import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"
import { AccountDrizzleRepository } from "@/modules/account/infra/repositories/account.drizzle"
import { CategoryDrizzleRepository } from "@/modules/category/infra/repositories/category.drizzle"
import { CreditCardInvoiceDrizzleRepository } from "@/modules/credit-card-invoice/infra/repositories/credit-card-invoice.drizzle"
import { CreditCardDrizzleRepository } from "@/modules/credit-card/infra/repositories/credit-card.drizzle"

import {
    createTransactionSchema,
    createTransferSchema,
    findTransactionsQuerySchema,
    updateTransactionSchema,
} from "../../app/schemas"
import {
    CreateTransactionUseCase,
    CreateTransferUseCase,
    DeleteTransactionUseCase,
    DeleteTransferUseCase,
    FindTransactionsUseCase,
    GenerateDueRecurrencesUseCase,
    GetTransactionUseCase,
    UpdateTransactionUseCase,
} from "../../app/usecases"
import { TransactionController } from "../controllers/transaction.controller"
import { InstallmentGroupDrizzleRepository } from "../repositories/installment-group.drizzle"
import { RecurrenceDrizzleRepository } from "../repositories/recurrence.drizzle"
import { TransactionDrizzleRepository } from "../repositories/transaction.drizzle"

function buildController() {
    const repository = new TransactionDrizzleRepository()
    const accountRepository = new AccountDrizzleRepository()
    const categoryRepository = new CategoryDrizzleRepository()
    const recurrenceRepository = new RecurrenceDrizzleRepository()
    const creditCardRepository = new CreditCardDrizzleRepository()
    const creditCardInvoiceRepository = new CreditCardInvoiceDrizzleRepository()
    const installmentGroupRepository = new InstallmentGroupDrizzleRepository()

    return new TransactionController({
        find: new FindTransactionsUseCase(repository),
        get: new GetTransactionUseCase(repository),
        create: new CreateTransactionUseCase(
            repository,
            accountRepository,
            categoryRepository,
            recurrenceRepository,
            creditCardRepository,
            creditCardInvoiceRepository,
            installmentGroupRepository,
        ),
        update: new UpdateTransactionUseCase(
            repository,
            accountRepository,
            categoryRepository,
            creditCardRepository,
            creditCardInvoiceRepository,
        ),
        delete: new DeleteTransactionUseCase(repository, installmentGroupRepository),
        createTransfer: new CreateTransferUseCase(repository, accountRepository),
        deleteTransfer: new DeleteTransferUseCase(repository),
        generateDueRecurrences: new GenerateDueRecurrencesUseCase(repository, recurrenceRepository),
    })
}

const controller = buildController()

export const transactionRoutes = new Elysia({ prefix: "/transactions", tags: ["Transactions"] })
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findTransactionsQuerySchema,
                detail: {
                    summary: "List transactions",
                    description: "Supports filters by account, category, status, type, and date range.",
                    responses: { 200: { description: "Cursor-paginated list of transactions" } },
                },
            })
            .post(
                "/transfer",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.createTransfer(user.id, body)
                },
                {
                    body: createTransferSchema,
                    detail: {
                        summary: "Create a transfer between two accounts",
                        description:
                            "Creates two linked transactions (outflow/inflow) and the transfer record, atomically.",
                        responses: { 201: { description: "Transfer created" } },
                    },
                },
            )
            .delete(
                "/transfer/:transferId",
                ({ params, user }) => controller.deleteTransfer(user.id, params.transferId),
                {
                    detail: {
                        summary: "Delete a transfer",
                        description:
                            "Deletes both linked transactions (outflow/inflow) and the transfer record, atomically.",
                        responses: { 200: { description: "Transfer deleted" }, 404: { description: "Transfer not found" } },
                    },
                },
            )
            .post("/recurrences/generate", ({ user }) => controller.generateDueRecurrences(user.id), {
                detail: {
                    summary: "Generate due recurring transaction occurrences",
                    description:
                        "Materializes the next occurrence for each due recurrence. Manual trigger until a scheduler exists.",
                    responses: { 200: { description: "Occurrences generated" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get transaction",
                    responses: {
                        200: { description: "Transaction found" },
                        404: { description: "Transaction not found" },
                    },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createTransactionSchema,
                    detail: {
                        summary: "Create transaction",
                        description: "Accepts an optional `recurrence` block to create a recurring transaction.",
                        responses: { 201: { description: "Transaction created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateTransactionSchema,
                detail: {
                    summary: "Update transaction",
                    responses: {
                        200: { description: "Transaction updated" },
                        404: { description: "Transaction not found" },
                    },
                },
            })
            .delete("/:id", ({ params, user }) => controller.delete(user.id, params.id), {
                detail: {
                    summary: "Delete transaction",
                    responses: {
                        200: { description: "Transaction deleted" },
                        404: { description: "Transaction not found" },
                    },
                },
            }),
    )
