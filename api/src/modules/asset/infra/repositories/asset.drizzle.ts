import { ilike, and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { assets } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { AssetDto } from "../../app/dtos"
import type { CreateAssetSchema, FindAssetsQuery, UpdateAssetSchema } from "../../app/schemas"
import type { AssetRepository } from "../../domain/repositories"
import { mapAssetToDto } from "../mappers"

export class AssetDrizzleRepository implements AssetRepository {
    async find(userId: string, params: FindAssetsQuery): Promise<ICursorPaginated<AssetDto>> {
        const where = and(eq(assets.userId, userId), params.query ? ilike(assets.name, `%${params.query}%`) : undefined)

        const sort = {
            column: assets.createdAt,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: assets.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(assets)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: assets.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(assets).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        return buildCursorPage(rows.map(mapAssetToDto), params.limit, params, total, {
            getValue: (row: AssetDto) => row.createdAt,
        })
    }

    async get(userId: string, id: string): Promise<AssetDto | null> {
        const [row] = await db
            .select()
            .from(assets)
            .where(and(eq(assets.userId, userId), eq(assets.id, id)))

        return row ? mapAssetToDto(row) : null
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

        return mapAssetToDto(row)
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
