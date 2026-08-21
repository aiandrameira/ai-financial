import type { creditCardInvoices } from "@/db/schema"

import type { CreditCardInvoiceDto } from "../../app/dtos"
import { stInvoiceEnum } from "../../domain/enums"

type InvoiceRow = typeof creditCardInvoices.$inferSelect

export function mapCreditCardInvoiceToDto(row: InvoiceRow, totalAmount = "0.00"): CreditCardInvoiceDto {
    const status = row.paidAt
        ? stInvoiceEnum.PAID
        : row.closingDate <= new Date()
          ? stInvoiceEnum.CLOSED
          : stInvoiceEnum.OPEN

    return {
        id: row.id,
        creditCardId: row.creditCardId,
        referenceMonth: row.referenceMonth.toISOString(),
        closingDate: row.closingDate.toISOString(),
        dueDate: row.dueDate.toISOString(),
        status,
        totalAmount,
        paidAt: row.paidAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
