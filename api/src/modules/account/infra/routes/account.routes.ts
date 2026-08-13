import { Elysia } from "elysia"

import { env } from "@/env"
import { paginationQuerySchema } from "@/http/api/schema/schemas"

import { createAccountSchema, updateAccountSchema } from "../../app/schemas/account.schema"
import { ArchiveAccountUseCase } from "../../app/usecases/archive-account.usecase"
import { CreateAccountUseCase } from "../../app/usecases/create-account.usecase"
import { FindAccountsUseCase } from "../../app/usecases/find-accounts.usecase"
import { GetAccountUseCase } from "../../app/usecases/get-account.usecase"
import { RestoreAccountUseCase } from "../../app/usecases/restore-account.usecase"
import { UpdateAccountUseCase } from "../../app/usecases/update-account.usecase"
import { AccountController } from "../controllers/account.controller"
import { AccountDrizzleRepository } from "../repositories/account.drizzle"

function buildController() {
    const repository = new AccountDrizzleRepository()
    return new AccountController({
        find: new FindAccountsUseCase(repository),
        get: new GetAccountUseCase(repository),
        create: new CreateAccountUseCase(repository),
        update: new UpdateAccountUseCase(repository),
        archive: new ArchiveAccountUseCase(repository),
        restore: new RestoreAccountUseCase(repository),
    })
}

const controller = buildController()

export const accountRoutes = new Elysia({ prefix: "/accounts", tags: ["Accounts"] })
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: paginationQuerySchema,
        detail: {
            summary: "List accounts",
            description: "Contas ativas (não arquivadas) do usuário, com saldo atual e projetado calculados.",
            responses: { 200: { description: "Lista paginada de contas" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get account",
            responses: { 200: { description: "Conta encontrada" }, 404: { description: "Conta não encontrada" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createAccountSchema,
            detail: {
                summary: "Create account",
                responses: { 201: { description: "Conta criada" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateAccountSchema,
        detail: {
            summary: "Update account",
            responses: { 200: { description: "Conta atualizada" }, 404: { description: "Conta não encontrada" } },
        },
    })
    .post("/:id/archive", ({ params }) => controller.archive(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Archive account",
            description: "Arquiva a conta em vez de excluí-la, preservando o histórico de transações.",
            responses: { 200: { description: "Conta arquivada" }, 404: { description: "Conta não encontrada" } },
        },
    })
    .post("/:id/restore", ({ params }) => controller.restore(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Restore an archived account",
            responses: { 200: { description: "Conta restaurada" }, 404: { description: "Conta não encontrada" } },
        },
    })
