import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

import { createAccountSchema, findAccountsQuerySchema, updateAccountSchema } from "../../app/schemas"
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
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findAccountsQuerySchema,
                detail: {
                    summary: "List accounts",
                    responses: { 200: { description: "Cursor-paginated list of accounts" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get account",
                    responses: { 200: { description: "Account found" }, 404: { description: "Account not found" } },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createAccountSchema,
                    detail: {
                        summary: "Create account",
                        responses: { 201: { description: "Account created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateAccountSchema,
                detail: {
                    summary: "Update account",
                    responses: { 200: { description: "Account updated" }, 404: { description: "Account not found" } },
                },
            })
            .post("/:id/archive", ({ params, user }) => controller.archive(user.id, params.id), {
                detail: {
                    summary: "Archive account",
                    responses: { 200: { description: "Account archived" }, 404: { description: "Account not found" } },
                },
            })
            .post("/:id/restore", ({ params, user }) => controller.restore(user.id, params.id), {
                detail: {
                    summary: "Restore an archived account",
                    responses: { 200: { description: "Account restored" }, 404: { description: "Account not found" } },
                },
            }),
    )
