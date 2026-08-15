import { and, count, eq, isNull } from "drizzle-orm"

import { db } from "@/db/client"
import { creditCards } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreditCardDto } from "../../app/dtos"
import type { CreateCreditCardSchema, UpdateCreditCardSchema } from "../../app/schemas"
import type { CreditCardRepository } from "../../domain/repositories"

type CreditCardRow = typeof creditCards.$inferSelect

function toDto(row: CreditCardRow): CreditCardDto {
    return {
        id: row.id,
        name: row.name,
        accountId: row.accountId,
        institution: row.institution,
        limitAmount: row.limitAmount,
        closingDay: row.closingDay,
        dueDay: row.dueDay,
        network: row.network,
        icon: row.icon,
        archivedAt: row.archivedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class CreditCardDrizzleRepository implements CreditCardRepository {
    async find(userId: string, params: PaginationParams): Promise<IPaginated<CreditCardDto>> {
        const where = and(eq(creditCards.userId, userId), isNull(creditCards.archivedAt))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(creditCards)
                .where(where)
                .orderBy(creditCards.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(creditCards).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async get(userId: string, id: string): Promise<CreditCardDto | null> {
        const [row] = await db
            .select()
            .from(creditCards)
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))

        return row ? toDto(row) : null
    }

    async create(userId: string, body: CreateCreditCardSchema): Promise<CreditCardDto> {
        const [row] = await db
            .insert(creditCards)
            .values({
                userId,
                name: body.name,
                accountId: body.accountId,
                institution: body.institution,
                limitAmount: body.limitAmount.toFixed(2),
                closingDay: body.closingDay,
                dueDay: body.dueDay,
                network: body.network,
                icon: body.icon,
            })
            .returning()

        return toDto(row)
    }

    async update(userId: string, id: string, body: UpdateCreditCardSchema): Promise<void> {
        await db
            .update(creditCards)
            .set({
                ...body,
                limitAmount: body.limitAmount !== undefined ? body.limitAmount.toFixed(2) : undefined,
                updatedAt: new Date(),
            })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }

    async archive(userId: string, id: string): Promise<void> {
        await db
            .update(creditCards)
            .set({ archivedAt: new Date(), updatedAt: new Date() })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }

    async restore(userId: string, id: string): Promise<void> {
        await db
            .update(creditCards)
            .set({ archivedAt: null, updatedAt: new Date() })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }
}
