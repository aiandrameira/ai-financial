import type { tpCategoryEnum } from "../../domain/enums/tp-category.enum"

export type CategoryDto = {
    id: string
    name: string
    type: tpCategoryEnum
    parentId: string | null
    icon: string | null
    color: string | null
    createdAt: string
    updatedAt: string
}
