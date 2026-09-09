import { cron } from "@elysiajs/cron"
import { Elysia } from "elysia"

import { env } from "@/env"
import { GenerateDueRecurrencesUseCase } from "@/modules/transaction/app/usecases"
import { RecurrenceDrizzleRepository } from "@/modules/transaction/infra/repositories/recurrence.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

export type GenerateDueRecurrencesResult = {
    generated: number
}

export async function generateDueRecurrences(
    usecase: GenerateDueRecurrencesUseCase = new GenerateDueRecurrencesUseCase(
        new TransactionDrizzleRepository(),
        new RecurrenceDrizzleRepository(),
    ),
): Promise<GenerateDueRecurrencesResult> {
    const created = await usecase.execute(env.DEV_USER_ID)
    console.log(`[generate-due-recurrences] ${created.length} occurrence(s) generated`)
    return { generated: created.length }
}

export const generateDueRecurrencesJob = new Elysia().use(
    cron({
        name: "generate-due-recurrences",
        pattern: "0 5 * * *",
        run: () => generateDueRecurrences(),
    }),
)
