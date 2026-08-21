import type { accounts } from "@/db/schema"
import { addDecimal } from "@/http/helpers"

import type { AccountDto } from "../../app/dtos"

type AccountRow = typeof accounts.$inferSelect
export type Balances = { current: string; projected: string }

export function mapAccountToDto(row: AccountRow, balances?: Balances): AccountDto {
    const current = balances?.current ?? "0"
    const projected = balances?.projected ?? "0"

    return {
        id: row.id,
        name: row.name,
        type: row.type,
        institution: row.institution,
        initialBalance: row.initialBalance,
        currentBalance: addDecimal(row.initialBalance, current),
        projectedBalance: addDecimal(row.initialBalance, projected),
        color: row.color,
        icon: row.icon,
        archivedAt: row.archivedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
