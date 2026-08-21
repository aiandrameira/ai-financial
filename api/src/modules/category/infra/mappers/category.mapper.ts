import type { categories } from "@/db/schema"

import type { CategoryDto } from "../../app/dtos"

type CategoryRow = typeof categories.$inferSelect

export function mapCategoryToDto(row: CategoryRow): CategoryDto {
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
