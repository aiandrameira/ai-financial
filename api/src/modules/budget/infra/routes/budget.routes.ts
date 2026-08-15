import { Elysia } from "elysia"

import { env } from "@/env"
import { CategoryDrizzleRepository } from "@/modules/category/infra/repositories/category.drizzle"

import { createBudgetSchema, findBudgetsQuerySchema, updateBudgetSchema } from "../../app/schemas"
import { CreateBudgetUseCase, DeleteBudgetUseCase, FindBudgetsUseCase, GetBudgetUseCase, UpdateBudgetUseCase } from "../../app/usecases"
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
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findBudgetsQuerySchema,
        detail: {
            summary: "List budgets",
            description: "Supports filters by category and reference month. Includes computed realized amount.",
            responses: { 200: { description: "Paginated list of budgets" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get budget",
            responses: { 200: { description: "Budget found" }, 404: { description: "Budget not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createBudgetSchema,
            detail: {
                summary: "Create budget",
                description: "Only allowed for expense categories. One budget per category per month.",
                responses: { 201: { description: "Budget created" }, 409: { description: "Budget already exists for this category and month" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateBudgetSchema,
        detail: {
            summary: "Update budget planned amount",
            responses: { 200: { description: "Budget updated" }, 404: { description: "Budget not found" } },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete budget",
            responses: { 200: { description: "Budget deleted" }, 404: { description: "Budget not found" } },
        },
    })
