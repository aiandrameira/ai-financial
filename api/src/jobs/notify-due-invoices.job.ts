import { cron } from "@elysiajs/cron"
import { Elysia } from "elysia"

import { env } from "@/env"
import type { CreditCardInvoiceRepository } from "@/modules/credit-card-invoice/domain/repositories"
import { CreditCardInvoiceDrizzleRepository } from "@/modules/credit-card-invoice/infra/repositories/credit-card-invoice.drizzle"

const DUE_SOON_DAYS = 3
const MS_PER_DAY = 24 * 60 * 60 * 1000

export async function notifyDueInvoices(
    repository: CreditCardInvoiceRepository = new CreditCardInvoiceDrizzleRepository(),
): Promise<void> {
    if (!env.AI_FLOW_API_URL || !env.AI_FLOW_API_KEY) {
        console.warn("[notify-due-invoices] AI_FLOW_API_URL/AI_FLOW_API_KEY não configurados — pulando")
        return
    }

    const now = new Date()
    const maxDueDate = new Date(now.getTime() + DUE_SOON_DAYS * MS_PER_DAY)
    const invoices = await repository.findDueSoon(maxDueDate)

    for (const invoice of invoices) {
        const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - now.getTime()) / MS_PER_DAY)

        const response = await fetch(`${env.AI_FLOW_API_URL}/events`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.AI_FLOW_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "credit_card_invoice.due_soon",
                externalId: invoice.id,
                data: {
                    invoiceId: invoice.id,
                    cardName: invoice.cardName,
                    userId: invoice.userId,
                    dueDate: invoice.dueDate,
                    daysUntilDue,
                },
            }),
        })

        if (!response.ok) {
            console.error(
                `[notify-due-invoices] falha ao notificar AI Flow para a fatura ${invoice.id}: ${response.status}`,
            )
        }
    }
}

export const notifyDueInvoicesJob = new Elysia().use(
    cron({
        name: "notify-due-invoices",
        pattern: "0 8 * * *",
        run: () => notifyDueInvoices(),
    }),
)
