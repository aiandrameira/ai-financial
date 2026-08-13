import { Elysia } from "elysia"

import { env } from "@/env"
import { paginationQuerySchema } from "@/http/api/schema/schemas"

import { createAccountSchema, updateAccountSchema } from "../../app/schemas"
import {
    ArchiveAccountUseCase,
    CreateAccountUseCase,
    FindAccountsUseCase,
    GetAccountUseCase,
    RestoreAccountUseCase,
    UpdateAccountUseCase,
} from "../../app/usecases"
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
            responses: { 200: { description: "Paginated list of accounts" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get account",
            responses: { 200: { description: "Account found" }, 404: { description: "Account not found" } },
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
                responses: { 201: { description: "Account created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateAccountSchema,
        detail: {
            summary: "Update account",
            responses: { 200: { description: "Account updated" }, 404: { description: "Account not found" } },
        },
    })
    .post("/:id/archive", ({ params }) => controller.archive(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Archive account",
            responses: { 200: { description: "Account archived" }, 404: { description: "Account not found" } },
        },
    })
    .post("/:id/restore", ({ params }) => controller.restore(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Restore an archived account",
            responses: { 200: { description: "Account restored" }, 404: { description: "Account not found" } },
        },
    })
