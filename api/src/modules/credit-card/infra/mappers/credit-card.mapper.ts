import type { creditCards } from "@/db/schema"

import type { CreditCardDto } from "../../app/dtos"

type CreditCardRow = typeof creditCards.$inferSelect

export function mapCreditCardToDto(row: CreditCardRow): CreditCardDto {
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
