import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"
import { CreditCardDrizzleRepository } from "@/modules/credit-card/infra/repositories/credit-card.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

import { findCreditCardInvoicesQuerySchema, payCreditCardInvoiceSchema } from "../../app/schemas"
import {
    FindCreditCardInvoicesUseCase,
    GetCreditCardInvoiceUseCase,
    GetCurrentCreditCardInvoiceUseCase,
    PayCreditCardInvoiceUseCase,
} from "../../app/usecases"
import { CreditCardInvoiceController } from "../controllers/credit-card-invoice.controller"
import { CreditCardInvoiceDrizzleRepository } from "../repositories/credit-card-invoice.drizzle"

function buildController() {
    const repository = new CreditCardInvoiceDrizzleRepository()
    const creditCardRepository = new CreditCardDrizzleRepository()
    const transactionRepository = new TransactionDrizzleRepository()

    return new CreditCardInvoiceController({
        find: new FindCreditCardInvoicesUseCase(repository, creditCardRepository),
        get: new GetCreditCardInvoiceUseCase(repository),
        getCurrent: new GetCurrentCreditCardInvoiceUseCase(repository, creditCardRepository),
        pay: new PayCreditCardInvoiceUseCase(repository, creditCardRepository, transactionRepository),
    })
}

const controller = buildController()

export const creditCardInvoiceRoutes = new Elysia({
    prefix: "/credit-cards/:id/invoices",
    tags: ["Credit Card Invoices"],
})
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ params, query, user }) => controller.find(user.id, params.id, query), {
                query: findCreditCardInvoicesQuerySchema,
                detail: {
                    summary: "List credit card invoices",
                    responses: { 200: { description: "Cursor-paginated list of invoices" } },
                },
            })
            .get("/current", ({ params, user }) => controller.getCurrent(user.id, params.id), {
                detail: {
                    summary: "Get or create the current open invoice for a credit card",
                    responses: { 200: { description: "Current invoice" } },
                },
            })
            .get("/:invoiceId", ({ params, user }) => controller.get(user.id, params.id, params.invoiceId), {
                detail: {
                    summary: "Get credit card invoice",
                    responses: { 200: { description: "Invoice found" }, 404: { description: "Invoice not found" } },
                },
            })
            .post(
                "/:invoiceId/pay",
                ({ params, body, user }) => controller.pay(user.id, params.id, params.invoiceId, body),
                {
                    body: payCreditCardInvoiceSchema,
                    detail: {
                        summary: "Pay a credit card invoice",
                        description:
                            "Creates a settlement transaction on the card's associated account and marks the invoice as paid.",
                        responses: {
                            200: { description: "Invoice paid" },
                            404: { description: "Invoice not found" },
                            409: { description: "Invoice already paid" },
                        },
                    },
                },
            ),
    )
