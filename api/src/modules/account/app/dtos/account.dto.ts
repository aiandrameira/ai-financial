import type { tpAccountEnum } from "../../domain/enums/tp-account.enum"

export type AccountDto = {
    id: string
    name: string
    type: tpAccountEnum
    institution: string | null
    initialBalance: string
    currentBalance: string
    projectedBalance: string
    color: string | null
    icon: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}
