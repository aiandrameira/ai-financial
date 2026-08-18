import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test"

import { env } from "@/env"
import type { CreditCardInvoiceRepository, DueSoonInvoiceDto } from "@/modules/credit-card-invoice/domain/repositories"

import { notifyDueInvoices } from "./notify-due-invoices.job"

function fakeRepository(invoices: DueSoonInvoiceDto[]): CreditCardInvoiceRepository {
    return {
        find: mock(),
        get: mock(),
        getOrCreateForDate: mock(),
        pay: mock(),
        findDueSoon: mock(() => Promise.resolve(invoices)),
    } as unknown as CreditCardInvoiceRepository
}

describe("notifyDueInvoices", () => {
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

        await notifyDueInvoices(fakeRepository([]))

        expect(fetchMock).not.toHaveBeenCalled()
    })

    test("posts one event per due-soon invoice with the expected payload", async () => {
        const dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        const fetchMock = mock(() => Promise.resolve(new Response(null, { status: 200 })))
        globalThis.fetch = fetchMock as unknown as typeof fetch

        await notifyDueInvoices(fakeRepository([{ id: "inv-1", userId: "user-1", cardName: "Nubank", dueDate }]))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
        expect(url).toBe("http://localhost:3007/events")
        expect(init.headers).toMatchObject({ Authorization: "Bearer af_live_test" })

        const body = JSON.parse(init.body as string)
        expect(body.type).toBe("credit_card_invoice.due_soon")
        expect(body.externalId).toBe("inv-1")
        expect(body.data).toMatchObject({ invoiceId: "inv-1", cardName: "Nubank", userId: "user-1", daysUntilDue: 2 })
    })

    test("logs but does not throw when AI Flow responds with an error", async () => {
        const fetchMock = mock(() => Promise.resolve(new Response(null, { status: 401 })))
        globalThis.fetch = fetchMock as unknown as typeof fetch

        await expect(
            notifyDueInvoices(
                fakeRepository([
                    { id: "inv-1", userId: "user-1", cardName: "Nubank", dueDate: new Date().toISOString() },
                ]),
            ),
        ).resolves.toBeUndefined()
    })
})
