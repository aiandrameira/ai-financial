import { ilike, type AnyColumn, and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { categories } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { CategoryDto } from "../../app/dtos"
import type { CreateCategorySchema, UpdateCategorySchema } from "../../app/schemas"
import type { CategoryRepository, CategorySortColumn, FindCategoriesParams } from "../../domain/repositories"
import { mapCategoryToDto } from "../mappers"

type SortStrategy = {
    column: AnyColumn
    getValue: (row: CategoryDto) => string
    parseValue?: (value: string | number) => unknown
}

const SORT_STRATEGIES: Record<CategorySortColumn, SortStrategy> = {
    name: { column: categories.name, getValue: (row) => row.name },
    type: { column: categories.type, getValue: (row) => row.type },
    createdAt: {
        column: categories.createdAt,
        getValue: (row) => row.createdAt,
        parseValue: (value) => new Date(value),
    },
}

export class CategoryDrizzleRepository implements CategoryRepository {
    async find(userId: string, params: FindCategoriesParams): Promise<ICursorPaginated<CategoryDto>> {
        const filterWhere = and(
            eq(categories.userId, userId),
            params.query ? ilike(categories.name, `%${params.query}%`) : undefined,
        )

        const strategy = SORT_STRATEGIES[params.sortBy]
        const sort = { column: strategy.column, direction: params.sortDirection, parseValue: strategy.parseValue }
        const cursorCondition = cursorWhere({ id: categories.id }, params, sort)
        const pageWhere = cursorCondition ? and(filterWhere, cursorCondition) : filterWhere

        const rowsQuery = db
            .select()
            .from(categories)
            .where(pageWhere)
            .orderBy(...cursorOrder({ id: categories.id }, params, sort))
            .limit(params.limit + 1)

        const totalQuery = params.includeTotal
            ? db.select({ total: count() }).from(categories).where(filterWhere)
            : undefined

        const [rows, totalResult] = await Promise.all([rowsQuery, totalQuery])
        const total = totalResult ? totalResult[0].total : undefined
        const data = rows.map(mapCategoryToDto)

        return buildCursorPage(data, params.limit, params, total, { getValue: strategy.getValue })
    }

    async get(userId: string, id: string): Promise<CategoryDto | null> {
        const [row] = await db
            .select()
            .from(categories)
            .where(and(eq(categories.userId, userId), eq(categories.id, id)))

        return row ? mapCategoryToDto(row) : null
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

        return mapCategoryToDto(row)
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
