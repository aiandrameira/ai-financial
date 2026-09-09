import { describe, expect, mock, test } from "bun:test"

import type { GenerateDueRecurrencesUseCase } from "@/modules/transaction/app/usecases"
import type { TransactionDto } from "@/modules/transaction/app/dtos"

import { generateDueRecurrences } from "./generate-due-recurrences.job"

function fakeUseCase(created: TransactionDto[]): GenerateDueRecurrencesUseCase {
    return {
        execute: mock(() => Promise.resolve(created)),
    } as unknown as GenerateDueRecurrencesUseCase
}

describe("generateDueRecurrences", () => {
    test("returns zero when no recurrence is due", async () => {
        const result = await generateDueRecurrences(fakeUseCase([]))

        expect(result).toEqual({ generated: 0 })
    })

    test("returns the count of occurrences created", async () => {
        const usecase = fakeUseCase([{ id: "tx-1" } as TransactionDto, { id: "tx-2" } as TransactionDto])

        const result = await generateDueRecurrences(usecase)

        expect(result).toEqual({ generated: 2 })
        expect(usecase.execute).toHaveBeenCalledTimes(1)
    })
})
