import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm"

import { db } from "@/db/client"
import { transactions, transfers } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../../app/dtos/transaction.dto"
import type { FindTransactionsQuery } from "../../app/schemas/transaction.schema"
import type {
    CreateTransactionData,
    CreateTransferData,
    TransactionRepository,
    UpdateTransactionData,
} from "../../domain/repositories/transaction.repository"

type TransactionRow = typeof transactions.$inferSelect

function toDto(row: TransactionRow): TransactionDto {
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
                .select()
                .from(transactions)
                .where(where)
                .orderBy(desc(transactions.date), desc(transactions.createdAt))
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(transactions).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async get(userId: string, id: string): Promise<TransactionDto | null> {
        const [row] = await db
            .select()
            .from(transactions)
            .where(and(eq(transactions.userId, userId), eq(transactions.id, id)))

        return row ? toDto(row) : null
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
                    type: "transfer",
                    status: data.status,
                    // Negativo: sai da conta de origem — ver docs/planning.md seção 5.1 "Transferências".
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
                    type: "transfer",
                    status: data.status,
                    amount: data.amount,
                    description: data.description,
                    date: data.date,
                })
                .returning()

            const [transfer] = await tx
                .insert(transfers)
                .values({ userId, sourceTransactionId: source.id, destinationTransactionId: destination.id })
                .returning()

            await tx
                .update(transactions)
                .set({ transferId: transfer.id })
                .where(inArray(transactions.id, [source.id, destination.id]))

            return {
                source: toDto({ ...source, transferId: transfer.id }),
                destination: toDto({ ...destination, transferId: transfer.id }),
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
}
