import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

import { createCreditCardSchema, findCreditCardsQuerySchema, updateCreditCardSchema } from "../../app/schemas"
import {
    ArchiveCreditCardUseCase,
    CreateCreditCardUseCase,
    FindCreditCardsUseCase,
    GetCreditCardUseCase,
    RestoreCreditCardUseCase,
    UpdateCreditCardUseCase,
} from "../../app/usecases"
import { CreditCardController } from "../controllers/credit-card.controller"
import { CreditCardDrizzleRepository } from "../repositories/credit-card.drizzle"

function buildController() {
    const repository = new CreditCardDrizzleRepository()
    return new CreditCardController({
        find: new FindCreditCardsUseCase(repository),
        get: new GetCreditCardUseCase(repository),
        create: new CreateCreditCardUseCase(repository),
        update: new UpdateCreditCardUseCase(repository),
        archive: new ArchiveCreditCardUseCase(repository),
        restore: new RestoreCreditCardUseCase(repository),
    })
}

const controller = buildController()

export const creditCardRoutes = new Elysia({ prefix: "/credit-cards", tags: ["Credit Cards"] })
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findCreditCardsQuerySchema,
                detail: {
                    summary: "List credit cards",
                    responses: { 200: { description: "Cursor-paginated list of credit cards" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get credit card",
                    responses: { 200: { description: "Credit card found" }, 404: { description: "Credit card not found" } },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createCreditCardSchema,
                    detail: {
                        summary: "Create credit card",
                        responses: { 201: { description: "Credit card created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateCreditCardSchema,
                detail: {
                    summary: "Update credit card",
                    responses: { 200: { description: "Credit card updated" }, 404: { description: "Credit card not found" } },
                },
            })
            .post("/:id/archive", ({ params, user }) => controller.archive(user.id, params.id), {
                detail: {
                    summary: "Archive credit card",
                    responses: { 200: { description: "Credit card archived" }, 404: { description: "Credit card not found" } },
                },
            })
            .post("/:id/restore", ({ params, user }) => controller.restore(user.id, params.id), {
                detail: {
                    summary: "Restore an archived credit card",
                    responses: { 200: { description: "Credit card restored" }, 404: { description: "Credit card not found" } },
                },
            }),
    )
