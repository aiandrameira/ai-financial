import { cron } from "@elysiajs/cron"
import { Elysia } from "elysia"

import { env } from "@/env"
import { ApiResponse } from "@/http/api/response"
import type { CreditCardInvoiceRepository } from "@/modules/credit-card-invoice/domain/repositories"
import { CreditCardInvoiceDrizzleRepository } from "@/modules/credit-card-invoice/infra/repositories/credit-card-invoice.drizzle"

const DUE_SOON_DAYS = 3
const MS_PER_DAY = 24 * 60 * 60 * 1000

export type NotifyDueInvoicesResult = {
    configured: boolean
    checked: number
    notified: number
    failed: number
}

export async function notifyDueInvoices(
    repository: CreditCardInvoiceRepository = new CreditCardInvoiceDrizzleRepository(),
): Promise<NotifyDueInvoicesResult> {
    if (!env.AI_FLOW_API_URL || !env.AI_FLOW_API_KEY) {
        console.warn("[notify-due-invoices] AI_FLOW_API_URL/AI_FLOW_API_KEY não configurados — pulando")
        return { configured: false, checked: 0, notified: 0, failed: 0 }
    }

    const now = new Date()
    const maxDueDate = new Date(now.getTime() + DUE_SOON_DAYS * MS_PER_DAY)
    const invoices = await repository.findDueSoon(maxDueDate)

    let notified = 0
    let failed = 0

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

        if (response.ok) {
            notified++
        } else {
            failed++
            console.error(
                `[notify-due-invoices] falha ao notificar AI Flow para a fatura ${invoice.id}: ${response.status}`,
            )
        }
    }

    return { configured: true, checked: invoices.length, notified, failed }
}

export const notifyDueInvoicesJob = new Elysia()
    .use(
        cron({
            name: "notify-due-invoices",
            pattern: "0 8 * * *",
            run: () => notifyDueInvoices(),
        }),
    )
    .post("/jobs/notify-due-invoices", async () => ApiResponse.item(await notifyDueInvoices(), "Verificação de faturas concluída"), {
        detail: {
            summary: "Run the due-soon invoice check on demand",
            description: "Manually triggers the same check the daily cron runs — mostly useful for development and demos, to see an AI Flow execution happen without waiting for the schedule.",
            responses: { 200: { description: "Check ran; see checked/notified/failed counts" } },
        },
    })
