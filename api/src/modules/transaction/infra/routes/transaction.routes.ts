import { Elysia } from "elysia"

import { env } from "@/env"
import { AccountDrizzleRepository } from "@/modules/account/infra/repositories/account.drizzle"
import { CategoryDrizzleRepository } from "@/modules/category/infra/repositories/category.drizzle"

import {
    createTransactionSchema,
    createTransferSchema,
    findTransactionsQuerySchema,
    updateTransactionSchema,
} from "../../app/schemas/transaction.schema"
import { CreateTransactionUseCase } from "../../app/usecases/create-transaction.usecase"
import { CreateTransferUseCase } from "../../app/usecases/create-transfer.usecase"
import { DeleteTransactionUseCase } from "../../app/usecases/delete-transaction.usecase"
import { FindTransactionsUseCase } from "../../app/usecases/find-transactions.usecase"
import { GenerateDueRecurrencesUseCase } from "../../app/usecases/generate-due-recurrences.usecase"
import { GetTransactionUseCase } from "../../app/usecases/get-transaction.usecase"
import { UpdateTransactionUseCase } from "../../app/usecases/update-transaction.usecase"
import { TransactionController } from "../controllers/transaction.controller"
import { RecurrenceDrizzleRepository } from "../repositories/recurrence.drizzle"
import { TransactionDrizzleRepository } from "../repositories/transaction.drizzle"

function buildController() {
    const repository = new TransactionDrizzleRepository()
    const accountRepository = new AccountDrizzleRepository()
    const categoryRepository = new CategoryDrizzleRepository()
    const recurrenceRepository = new RecurrenceDrizzleRepository()

    return new TransactionController({
        find: new FindTransactionsUseCase(repository),
        get: new GetTransactionUseCase(repository),
        create: new CreateTransactionUseCase(repository, accountRepository, categoryRepository, recurrenceRepository),
        update: new UpdateTransactionUseCase(repository, accountRepository, categoryRepository),
        delete: new DeleteTransactionUseCase(repository),
        createTransfer: new CreateTransferUseCase(repository, accountRepository),
        generateDueRecurrences: new GenerateDueRecurrencesUseCase(repository, recurrenceRepository),
    })
}

const controller = buildController()

export const transactionRoutes = new Elysia({ prefix: "/transactions", tags: ["Transactions"] })
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findTransactionsQuerySchema,
        detail: {
            summary: "List transactions",
            description: "Suporta filtros por conta, categoria, status, tipo e intervalo de data.",
            responses: { 200: { description: "Lista paginada de transações" } },
        },
    })
    .post(
        "/transfer",
        ({ body, set }) => {
            set.status = 201
            return controller.createTransfer(env.DEV_USER_ID, body)
        },
        {
            body: createTransferSchema,
            detail: {
                summary: "Create a transfer between two accounts",
                description:
                    "Cria duas transações vinculadas (saída/entrada) e o registro de transferência, de forma atômica.",
                responses: { 201: { description: "Transferência criada" } },
            },
        },
    )
    .post("/recurrences/generate", () => controller.generateDueRecurrences(env.DEV_USER_ID), {
        detail: {
            summary: "Generate due recurring transaction occurrences",
            description:
                "Materializa a próxima ocorrência de cada recorrência vencida. Chamada manual até existir um scheduler.",
            responses: { 200: { description: "Ocorrências geradas" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get transaction",
            responses: {
                200: { description: "Transação encontrada" },
                404: { description: "Transação não encontrada" },
            },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createTransactionSchema,
            detail: {
                summary: "Create transaction",
                description: "Aceita um bloco `recurrence` opcional para criar uma transação recorrente.",
                responses: { 201: { description: "Transação criada" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateTransactionSchema,
        detail: {
            summary: "Update transaction",
            responses: {
                200: { description: "Transação atualizada" },
                404: { description: "Transação não encontrada" },
            },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete transaction",
            responses: { 200: { description: "Transação excluída" }, 404: { description: "Transação não encontrada" } },
        },
    })
