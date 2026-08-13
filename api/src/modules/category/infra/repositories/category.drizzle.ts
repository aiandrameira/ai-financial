import { and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { categories } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CategoryDto } from "../../app/dtos/category.dto"
import type { CreateCategorySchema, UpdateCategorySchema } from "../../app/schemas/category.schema"
import type { CategoryRepository } from "../../domain/repositories/category.repository"

type CategoryRow = typeof categories.$inferSelect

function toDto(row: CategoryRow): CategoryDto {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        parentId: row.parentId,
        icon: row.icon,
        color: row.color,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class CategoryDrizzleRepository implements CategoryRepository {
    async find(userId: string, params: PaginationParams): Promise<IPaginated<CategoryDto>> {
        const where = eq(categories.userId, userId)

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(categories)
                .where(where)
                .orderBy(categories.name)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(categories).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async get(userId: string, id: string): Promise<CategoryDto | null> {
        const [row] = await db
            .select()
            .from(categories)
            .where(and(eq(categories.userId, userId), eq(categories.id, id)))

        return row ? toDto(row) : null
    }

    async create(userId: string, body: CreateCategorySchema): Promise<CategoryDto> {
        const [row] = await db
            .insert(categories)
            .values({
                userId,
                name: body.name,
                type: body.type,
                parentId: body.parentId,
                icon: body.icon,
                color: body.color,
            })
            .returning()

        return toDto(row)
    }

    async update(userId: string, id: string, body: UpdateCategorySchema): Promise<void> {
        await db
            .update(categories)
            .set({ ...body, updatedAt: new Date() })
            .where(and(eq(categories.userId, userId), eq(categories.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.delete(categories).where(and(eq(categories.userId, userId), eq(categories.id, id)))
    }
}
