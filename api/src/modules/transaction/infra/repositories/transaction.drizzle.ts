import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm"

import { db } from "@/db/client"
import { transactions, transfers } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../../app/dtos"
import type { FindTransactionsQuery } from "../../app/schemas"
import type { tpTransferMethodEnum } from "../../domain/enums/tp-transfer-method.enum"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type {
    CreateTransactionData,
    CreateTransferData,
    TransactionRepository,
    UpdateTransactionData,
} from "../../domain/repositories"

type TransactionRow = typeof transactions.$inferSelect

function toDto(row: TransactionRow, transferMethod: tpTransferMethodEnum | null = null): TransactionDto {
    return {
        id: row.id,
        accountId: row.accountId,
        categoryId: row.categoryId,
        type: row.type,
        status: row.status,
        amount: row.amount,
        description: row.description,
        date: row.date.toISOString(),
        tags: row.tags,
        recurrenceId: row.recurrenceId,
        transferId: row.transferId,
        transferMethod,
        attachmentUrl: row.attachmentUrl,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class TransactionDrizzleRepository implements TransactionRepository {
    async find(userId: string, params: FindTransactionsQuery): Promise<IPaginated<TransactionDto>> {
        const where = and(
            eq(transactions.userId, userId),
            params.accountId ? eq(transactions.accountId, params.accountId) : undefined,
            params.categoryId ? eq(transactions.categoryId, params.categoryId) : undefined,
            params.status ? eq(transactions.status, params.status) : undefined,
            params.type ? eq(transactions.type, params.type) : undefined,
            params.dateFrom ? gte(transactions.date, params.dateFrom) : undefined,
            params.dateTo ? lte(transactions.date, params.dateTo) : undefined,
        )

        const [rows, [{ total }]] = await Promise.all([
            db
                .select({ transaction: transactions, transferMethod: transfers.method })
                .from(transactions)
                .leftJoin(transfers, eq(transactions.transferId, transfers.id))
                .where(where)
                .orderBy(desc(transactions.date), desc(transactions.createdAt))
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(transactions).where(where),
        ])

        return {
            data: rows.map((row) => toDto(row.transaction, row.transferMethod)),
            page: params.page,
            size: params.size,
            total,
        }
    }

    async get(userId: string, id: string): Promise<TransactionDto | null> {
        const [row] = await db
            .select({ transaction: transactions, transferMethod: transfers.method })
            .from(transactions)
            .leftJoin(transfers, eq(transactions.transferId, transfers.id))
            .where(and(eq(transactions.userId, userId), eq(transactions.id, id)))

        return row ? toDto(row.transaction, row.transferMethod) : null
    }

    async findLatestByRecurrence(userId: string, recurrenceId: string): Promise<TransactionDto | null> {
        const [row] = await db
            .select()
            .from(transactions)
            .where(and(eq(transactions.userId, userId), eq(transactions.recurrenceId, recurrenceId)))
            .orderBy(desc(transactions.date))
            .limit(1)

        return row ? toDto(row) : null
    }

    async create(userId: string, data: CreateTransactionData): Promise<TransactionDto> {
        const [row] = await db
            .insert(transactions)
            .values({
                userId,
                accountId: data.accountId,
                categoryId: data.categoryId,
                type: data.type,
                status: data.status,
                amount: data.amount,
                description: data.description,
                date: data.date,
                tags: data.tags,
                recurrenceId: data.recurrenceId,
                attachmentUrl: data.attachmentUrl,
            })
            .returning()

        return toDto(row)
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
                source: toDto({ ...source, transferId: transfer.id }, transfer.method),
                destination: toDto({ ...destination, transferId: transfer.id }, transfer.method),
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
