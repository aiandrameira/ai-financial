import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test"

import { env } from "@/env"
import type { DueSoonInstallmentDto, LoanInstallmentRepository } from "@/modules/loan/domain/repositories"

import { notifyDueInstallments } from "./notify-due-installments.job"

function fakeRepository(installments: DueSoonInstallmentDto[]): LoanInstallmentRepository {
    return {
        find: mock(),
        get: mock(),
        pay: mock(),
        findDueSoon: mock(() => Promise.resolve(installments)),
    } as unknown as LoanInstallmentRepository
}

describe("notifyDueInstallments", () => {
    const originalUrl = env.AI_FLOW_API_URL
    const originalKey = env.AI_FLOW_API_KEY
    const originalFetch = globalThis.fetch

    beforeEach(() => {
        env.AI_FLOW_API_URL = "http://localhost:3007"
        env.AI_FLOW_API_KEY = "af_live_test"
    })

    afterEach(() => {
        env.AI_FLOW_API_URL = originalUrl
        env.AI_FLOW_API_KEY = originalKey
        globalThis.fetch = originalFetch
    })

    test("does nothing when AI Flow is not configured", async () => {
        env.AI_FLOW_API_URL = ""
        const fetchMock = mock(() => Promise.resolve(new Response(null, { status: 200 })))
        globalThis.fetch = fetchMock as unknown as typeof fetch

        const result = await notifyDueInstallments(fakeRepository([]))

        expect(fetchMock).not.toHaveBeenCalled()
        expect(result).toEqual({ configured: false, checked: 0, notified: 0, failed: 0 })
    })

    test("posts one event per due-soon installment with the expected payload", async () => {
        const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        const fetchMock = mock(() => Promise.resolve(new Response(null, { status: 200 })))
        globalThis.fetch = fetchMock as unknown as typeof fetch

        const result = await notifyDueInstallments(
            fakeRepository([
                { id: "inst-1", userId: "user-1", loanName: "Financiamento do carro", installmentNumber: 3, dueDate },
            ]),
        )

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(result).toEqual({ configured: true, checked: 1, notified: 1, failed: 0 })

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
        expect(url).toBe("http://localhost:3007/events")
        expect(init.headers).toMatchObject({ Authorization: "Bearer af_live_test" })

        const body = JSON.parse(init.body as string)
        expect(body.type).toBe("loan_installment.due_soon")
        expect(body.externalId).toBe("inst-1")
        expect(body.data).toMatchObject({
            installmentId: "inst-1",
            loanName: "Financiamento do carro",
            installmentNumber: 3,
            userId: "user-1",
            daysUntilDue: 2,
        })
    })

    test("counts failures without throwing when AI Flow responds with an error", async () => {
        const fetchMock = mock(() => Promise.resolve(new Response(null, { status: 401 })))
        globalThis.fetch = fetchMock as unknown as typeof fetch

        const result = await notifyDueInstallments(
            fakeRepository([
                {
                    id: "inst-1",
                    userId: "user-1",
                    loanName: "Financiamento do carro",
                    installmentNumber: 3,
                    dueDate: new Date().toISOString(),
                },
            ]),
        )

        expect(result).toEqual({ configured: true, checked: 1, notified: 0, failed: 1 })
    })
})
