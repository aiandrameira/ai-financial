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
        const result = await generateDueRecurrences(fakeUseCase([]), () => Promise.resolve("user-1"))

        expect(result).toEqual({ generated: 0 })
    })

    test("returns the count of occurrences created", async () => {
        const usecase = fakeUseCase([{ id: "tx-1" } as TransactionDto, { id: "tx-2" } as TransactionDto])

        const result = await generateDueRecurrences(usecase, () => Promise.resolve("user-1"))

        expect(result).toEqual({ generated: 2 })
        expect(usecase.execute).toHaveBeenCalledTimes(1)
        expect(usecase.execute).toHaveBeenCalledWith("user-1")
    })

    test("returns zero and does not call the use case when no user exists", async () => {
        const usecase = fakeUseCase([{ id: "tx-1" } as TransactionDto])

        const result = await generateDueRecurrences(usecase, () => Promise.resolve(null))

        expect(result).toEqual({ generated: 0 })
        expect(usecase.execute).not.toHaveBeenCalled()
    })
})
