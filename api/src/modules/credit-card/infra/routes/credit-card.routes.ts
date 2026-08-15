import { Elysia } from "elysia"

import { env } from "@/env"
import { paginationQuerySchema } from "@/http/api/schema/schemas"

import { createCreditCardSchema, updateCreditCardSchema } from "../../app/schemas"
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
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: paginationQuerySchema,
        detail: {
            summary: "List credit cards",
            responses: { 200: { description: "Paginated list of credit cards" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get credit card",
            responses: { 200: { description: "Credit card found" }, 404: { description: "Credit card not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createCreditCardSchema,
            detail: {
                summary: "Create credit card",
                responses: { 201: { description: "Credit card created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateCreditCardSchema,
        detail: {
            summary: "Update credit card",
            responses: { 200: { description: "Credit card updated" }, 404: { description: "Credit card not found" } },
        },
    })
    .post("/:id/archive", ({ params }) => controller.archive(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Archive credit card",
            responses: { 200: { description: "Credit card archived" }, 404: { description: "Credit card not found" } },
        },
    })
    .post("/:id/restore", ({ params }) => controller.restore(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Restore an archived credit card",
            responses: { 200: { description: "Credit card restored" }, 404: { description: "Credit card not found" } },
        },
    })
