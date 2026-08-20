import { cron } from "@elysiajs/cron"
import { Elysia } from "elysia"

import { env } from "@/env"
import { ApiResponse } from "@/http/api/response"
import type { LoanInstallmentRepository } from "@/modules/loan/domain/repositories"
import { LoanInstallmentDrizzleRepository } from "@/modules/loan/infra/repositories/loan-installment.drizzle"

const DUE_SOON_DAYS = 3
const MS_PER_DAY = 24 * 60 * 60 * 1000

export type NotifyDueInstallmentsResult = {
    configured: boolean
    checked: number
    notified: number
    failed: number
}

export async function notifyDueInstallments(
    repository: LoanInstallmentRepository = new LoanInstallmentDrizzleRepository(),
): Promise<NotifyDueInstallmentsResult> {
    if (!env.AI_FLOW_API_URL || !env.AI_FLOW_API_KEY) {
        console.warn("[notify-due-installments] AI_FLOW_API_URL/AI_FLOW_API_KEY não configurados — pulando")
        return { configured: false, checked: 0, notified: 0, failed: 0 }
    }

    const now = new Date()
    const maxDueDate = new Date(now.getTime() + DUE_SOON_DAYS * MS_PER_DAY)
    const installments = await repository.findDueSoon(maxDueDate)

    let notified = 0
    let failed = 0

    for (const installment of installments) {
        const daysUntilDue = Math.ceil((new Date(installment.dueDate).getTime() - now.getTime()) / MS_PER_DAY)

        const response = await fetch(`${env.AI_FLOW_API_URL}/events`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.AI_FLOW_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "loan_installment.due_soon",
                externalId: installment.id,
                data: {
                    installmentId: installment.id,
                    loanName: installment.loanName,
                    installmentNumber: installment.installmentNumber,
                    userId: installment.userId,
                    dueDate: installment.dueDate,
                    daysUntilDue,
                },
            }),
        })

        if (response.ok) {
            notified++
        } else {
            failed++
            console.error(
                `[notify-due-installments] falha ao notificar AI Flow para a parcela ${installment.id}: ${response.status}`,
            )
        }
    }

    return { configured: true, checked: installments.length, notified, failed }
}

export const notifyDueInstallmentsJob = new Elysia()
    .use(
        cron({
            name: "notify-due-installments",
            pattern: "0 8 * * *",
            run: () => notifyDueInstallments(),
        }),
    )
    .post(
        "/jobs/notify-due-installments",
        async () => ApiResponse.item(await notifyDueInstallments(), "Verificação de parcelas concluída"),
        {
            detail: {
                summary: "Run the due-soon loan installment check on demand",
                description:
                    "Manually triggers the same check the daily cron runs — mostly useful for development and demos, to see an AI Flow execution happen without waiting for the schedule.",
                responses: { 200: { description: "Check ran; see checked/notified/failed counts" } },
            },
        },
    )
