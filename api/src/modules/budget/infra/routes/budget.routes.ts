import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"
import { CategoryDrizzleRepository } from "@/modules/category/infra/repositories/category.drizzle"

import { createBudgetSchema, findBudgetsQuerySchema, updateBudgetSchema } from "../../app/schemas"
import {
    CreateBudgetUseCase,
    DeleteBudgetUseCase,
    FindBudgetsUseCase,
    GetBudgetUseCase,
    UpdateBudgetUseCase,
} from "../../app/usecases"
import { BudgetController } from "../controllers/budget.controller"
import { BudgetDrizzleRepository } from "../repositories/budget.drizzle"

function buildController() {
    const repository = new BudgetDrizzleRepository()
    const categoryRepository = new CategoryDrizzleRepository()

    return new BudgetController({
        find: new FindBudgetsUseCase(repository),
        get: new GetBudgetUseCase(repository),
        create: new CreateBudgetUseCase(repository, categoryRepository),
        update: new UpdateBudgetUseCase(repository),
        delete: new DeleteBudgetUseCase(repository),
    })
}

const controller = buildController()

export const budgetRoutes = new Elysia({ prefix: "/budgets", tags: ["Budgets"] })
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findBudgetsQuerySchema,
                detail: {
                    summary: "List budgets",
                    description: "Supports filters by category and reference month. Includes computed realized amount.",
                    responses: { 200: { description: "Cursor-paginated list of budgets" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get budget",
                    responses: { 200: { description: "Budget found" }, 404: { description: "Budget not found" } },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createBudgetSchema,
                    detail: {
                        summary: "Create budget",
                        description: "Only allowed for expense categories. One budget per category per month.",
                        responses: {
                            201: { description: "Budget created" },
                            409: { description: "Budget already exists for this category and month" },
                        },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateBudgetSchema,
                detail: {
                    summary: "Update budget planned amount",
                    responses: { 200: { description: "Budget updated" }, 404: { description: "Budget not found" } },
                },
            })
            .delete("/:id", ({ params, user }) => controller.delete(user.id, params.id), {
                detail: {
                    summary: "Delete budget",
                    responses: { 200: { description: "Budget deleted" }, 404: { description: "Budget not found" } },
                },
            }),
    )
