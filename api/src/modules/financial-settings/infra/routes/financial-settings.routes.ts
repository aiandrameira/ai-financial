import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

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
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ user }) => controller.get(user.id), {
                detail: {
                    summary: "Get financial settings",
                    description: "Returns the user's monthly income setting, defaulting to zero if never set.",
                    responses: { 200: { description: "Financial settings" } },
                },
            })
            .put("/", ({ body, user }) => controller.update(user.id, body), {
                body: updateFinancialSettingsSchema,
                detail: {
                    summary: "Update financial settings",
                    description: "Upserts the user's monthly income.",
                    responses: { 200: { description: "Financial settings updated" } },
                },
            }),
    )
