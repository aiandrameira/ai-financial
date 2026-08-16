import { and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { assets } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { AssetDto } from "../../app/dtos"
import type { CreateAssetSchema, FindAssetsQuery, UpdateAssetSchema } from "../../app/schemas"
import type { AssetRepository } from "../../domain/repositories"

type AssetRow = typeof assets.$inferSelect

function toDto(row: AssetRow): AssetDto {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        purchaseValue: row.purchaseValue,
        currentValue: row.currentValue,
        acquiredAt: row.acquiredAt.toISOString(),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class AssetDrizzleRepository implements AssetRepository {
    async find(userId: string, params: FindAssetsQuery): Promise<IPaginated<AssetDto>> {
        const where = eq(assets.userId, userId)

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(assets)
                .where(where)
                .orderBy(assets.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(assets).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async get(userId: string, id: string): Promise<AssetDto | null> {
        const [row] = await db
            .select()
            .from(assets)
            .where(and(eq(assets.userId, userId), eq(assets.id, id)))

        return row ? toDto(row) : null
    }

    async create(userId: string, body: CreateAssetSchema): Promise<AssetDto> {
        const [row] = await db
            .insert(assets)
            .values({
                userId,
                name: body.name,
                type: body.type,
                purchaseValue: body.purchaseValue.toFixed(2),
                currentValue: body.currentValue.toFixed(2),
                acquiredAt: body.acquiredAt,
            })
            .returning()

        return toDto(row)
    }

    async update(userId: string, id: string, body: UpdateAssetSchema): Promise<void> {
        await db
            .update(assets)
            .set({
                name: body.name,
                type: body.type,
                purchaseValue: body.purchaseValue.toFixed(2),
                currentValue: body.currentValue.toFixed(2),
                acquiredAt: body.acquiredAt,
                updatedAt: new Date(),
            })
            .where(and(eq(assets.userId, userId), eq(assets.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.delete(assets).where(and(eq(assets.userId, userId), eq(assets.id, id)))
    }
}
