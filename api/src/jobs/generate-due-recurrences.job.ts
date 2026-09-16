import { cron } from "@elysiajs/cron"
import { Elysia } from "elysia"

import { db } from "@/db/client"
import { users } from "@/db/schema"
import { GenerateDueRecurrencesUseCase } from "@/modules/transaction/app/usecases"
import { RecurrenceDrizzleRepository } from "@/modules/transaction/infra/repositories/recurrence.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

export type GenerateDueRecurrencesResult = {
    generated: number
}

async function resolveSingleUserId(): Promise<string | null> {
    const [user] = await db.select({ id: users.id }).from(users).limit(1)
    return user?.id ?? null
}

export async function generateDueRecurrences(
    usecase: GenerateDueRecurrencesUseCase = new GenerateDueRecurrencesUseCase(
        new TransactionDrizzleRepository(),
        new RecurrenceDrizzleRepository(),
    ),
    resolveUserId: () => Promise<string | null> = resolveSingleUserId,
): Promise<GenerateDueRecurrencesResult> {
    const userId = await resolveUserId()
    if (!userId) {
        console.warn("[generate-due-recurrences] nenhum usuário cadastrado — pulando")
        return { generated: 0 }
    }

    const created = await usecase.execute(userId)
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
