import { ilike, and, count, desc, eq, gte, inArray, lte } from "drizzle-orm"

import { db } from "@/db/client"
import { creditCardInvoices, installmentGroups, transactions, transfers } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { TransactionDto } from "../../app/dtos"
import type { FindTransactionsQuery } from "../../app/schemas"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type {
    CreateTransactionData,
    CreateTransferData,
    TransactionRepository,
    UpdateTransactionData,
} from "../../domain/repositories"
import { mapTransactionToDto } from "../mappers"

export class TransactionDrizzleRepository implements TransactionRepository {
    async find(userId: string, params: FindTransactionsQuery): Promise<ICursorPaginated<TransactionDto>> {
        const where = and(
            eq(transactions.userId, userId),
            params.query ? ilike(transactions.description, `%${params.query}%`) : undefined,
            params.accountId ? eq(transactions.accountId, params.accountId) : undefined,
            params.invoiceId ? eq(transactions.invoiceId, params.invoiceId) : undefined,
            params.categoryId ? eq(transactions.categoryId, params.categoryId) : undefined,
            params.status ? eq(transactions.status, params.status) : undefined,
            params.type ? eq(transactions.type, params.type) : undefined,
            params.dateFrom ? gte(transactions.date, params.dateFrom) : undefined,
            params.dateTo ? lte(transactions.date, params.dateTo) : undefined,
        )

        const sort = {
            column: transactions.date,
            direction: "desc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: transactions.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select({
                    transaction: transactions,
                    transferMethod: transfers.method,
                    creditCardId: creditCardInvoices.creditCardId,
                    installmentsTotal: installmentGroups.installmentsTotal,
                })
                .from(transactions)
                .leftJoin(transfers, eq(transactions.transferId, transfers.id))
                .leftJoin(creditCardInvoices, eq(transactions.invoiceId, creditCardInvoices.id))
                .leftJoin(installmentGroups, eq(transactions.installmentGroupId, installmentGroups.id))
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: transactions.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(transactions).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        return buildCursorPage(
            rows.map((row) =>
                mapTransactionToDto(row.transaction, row.transferMethod, row.creditCardId, row.installmentsTotal),
            ),
            params.limit,
            params,
            total,
            { getValue: (row: TransactionDto) => row.date },
        )
    }

    async get(userId: string, id: string): Promise<TransactionDto | null> {
        const [row] = await db
            .select({
                transaction: transactions,
                transferMethod: transfers.method,
                creditCardId: creditCardInvoices.creditCardId,
                installmentsTotal: installmentGroups.installmentsTotal,
            })
            .from(transactions)
            .leftJoin(transfers, eq(transactions.transferId, transfers.id))
            .leftJoin(creditCardInvoices, eq(transactions.invoiceId, creditCardInvoices.id))
            .leftJoin(installmentGroups, eq(transactions.installmentGroupId, installmentGroups.id))
            .where(and(eq(transactions.userId, userId), eq(transactions.id, id)))

        return row
            ? mapTransactionToDto(row.transaction, row.transferMethod, row.creditCardId, row.installmentsTotal)
            : null
    }

    async findLatestByRecurrence(userId: string, recurrenceId: string): Promise<TransactionDto | null> {
        const [row] = await db
            .select()
            .from(transactions)
            .where(and(eq(transactions.userId, userId), eq(transactions.recurrenceId, recurrenceId)))
            .orderBy(desc(transactions.date))
            .limit(1)

        return row ? mapTransactionToDto(row) : null
    }

    async create(userId: string, data: CreateTransactionData): Promise<TransactionDto> {
        const [row] = await db
            .insert(transactions)
            .values({
                userId,
                accountId: data.accountId,
                invoiceId: data.invoiceId,
                categoryId: data.categoryId,
                type: data.type,
                status: data.status,
                amount: data.amount,
                description: data.description,
                date: data.date,
                tags: data.tags,
                recurrenceId: data.recurrenceId,
                installmentGroupId: data.installmentGroupId,
                installmentNumber: data.installmentNumber,
                attachmentUrl: data.attachmentUrl,
            })
            .returning()

        return mapTransactionToDto(row)
    }

    async createTransfer(
        userId: string,
        data: CreateTransferData,
    ): Promise<{ source: TransactionDto; destination: TransactionDto }> {
        return db.transaction(async (tx) => {
            const [source] = await tx
                .insert(transactions)
                .values({
                    userId,
                    accountId: data.sourceAccountId,
                    type: tpTransactionEnum.TRANSFER,
                    status: data.status,
                    amount: `-${data.amount}`,
                    description: data.description,
                    date: data.date,
                })
                .returning()

            const [destination] = await tx
                .insert(transactions)
                .values({
                    userId,
                    accountId: data.destinationAccountId,
                    type: tpTransactionEnum.TRANSFER,
                    status: data.status,
                    amount: data.amount,
                    description: data.description,
                    date: data.date,
                })
                .returning()

            const [transfer] = await tx
                .insert(transfers)
                .values({
                    userId,
                    sourceTransactionId: source.id,
                    destinationTransactionId: destination.id,
                    method: data.method,
                })
                .returning()

            await tx
                .update(transactions)
                .set({ transferId: transfer.id })
                .where(inArray(transactions.id, [source.id, destination.id]))

            return {
                source: mapTransactionToDto({ ...source, transferId: transfer.id }, transfer.method),
                destination: mapTransactionToDto({ ...destination, transferId: transfer.id }, transfer.method),
            }
        })
    }

    async update(userId: string, id: string, data: UpdateTransactionData): Promise<void> {
        await db
            .update(transactions)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(transactions.userId, userId), eq(transactions.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.delete(transactions).where(and(eq(transactions.userId, userId), eq(transactions.id, id)))
    }

    async deleteByInstallmentGroup(userId: string, installmentGroupId: string): Promise<void> {
        await db
            .delete(transactions)
            .where(and(eq(transactions.userId, userId), eq(transactions.installmentGroupId, installmentGroupId)))
    }

    async deleteTransfer(userId: string, transferId: string): Promise<boolean> {
        return db.transaction(async (tx) => {
            const [transfer] = await tx
                .select()
                .from(transfers)
                .where(and(eq(transfers.userId, userId), eq(transfers.id, transferId)))

            if (!transfer) return false

            await tx.delete(transfers).where(eq(transfers.id, transferId))

            await tx
                .delete(transactions)
                .where(inArray(transactions.id, [transfer.sourceTransactionId, transfer.destinationTransactionId]))

            return true
        })
    }
}
