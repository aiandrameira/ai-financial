import { Elysia } from "elysia"

import { env } from "@/env"

import { updateFinancialSettingsSchema } from "../../app/schemas"
import { GetFinancialSettingsUseCase, UpdateFinancialSettingsUseCase } from "../../app/usecases"
import { FinancialSettingsController } from "../controllers/financial-settings.controller"
import { FinancialSettingsDrizzleRepository } from "../repositories/financial-settings.drizzle"

function buildController() {
    const repository = new FinancialSettingsDrizzleRepository()

    return new FinancialSettingsController({
        get: new GetFinancialSettingsUseCase(repository),
        update: new UpdateFinancialSettingsUseCase(repository),
    })
}

const controller = buildController()

export const financialSettingsRoutes = new Elysia({ prefix: "/financial-settings", tags: ["Financial Settings"] })
    .get("/", () => controller.get(env.DEV_USER_ID), {
        detail: {
            summary: "Get financial settings",
            description: "Returns the user's monthly income setting, defaulting to zero if never set.",
            responses: { 200: { description: "Financial settings" } },
        },
    })
    .put("/", ({ body }) => controller.update(env.DEV_USER_ID, body), {
        body: updateFinancialSettingsSchema,
        detail: {
            summary: "Update financial settings",
            description: "Upserts the user's monthly income.",
            responses: { 200: { description: "Financial settings updated" } },
        },
    })
