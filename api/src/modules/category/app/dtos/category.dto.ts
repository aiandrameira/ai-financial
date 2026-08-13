export type CategoryDto = {
    id: string
    name: string
    type: "income" | "expense"
    parentId: string | null
    icon: string | null
    color: string | null
    createdAt: string
    updatedAt: string
}
