import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

import { createCategorySchema, findCategoriesQuerySchema, updateCategorySchema } from "../../app/schemas"
import {
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    FindCategoriesUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
} from "../../app/usecases"
import { CategoryController } from "../controllers/category.controller"
import { CategoryDrizzleRepository } from "../repositories/category.drizzle"

function buildController() {
    const repository = new CategoryDrizzleRepository()
    return new CategoryController({
        find: new FindCategoriesUseCase(repository),
        get: new GetCategoryUseCase(repository),
        create: new CreateCategoryUseCase(repository),
        update: new UpdateCategoryUseCase(repository),
        delete: new DeleteCategoryUseCase(repository),
    })
}

const controller = buildController()

export const categoryRoutes = new Elysia({ prefix: "/categories", tags: ["Categories"] })
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findCategoriesQuerySchema,
                detail: {
                    summary: "List categories",
                    responses: { 200: { description: "Cursor-paginated list of categories" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get category",
                    responses: { 200: { description: "Category found" }, 404: { description: "Category not found" } },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createCategorySchema,
                    detail: {
                        summary: "Create category",
                        responses: { 201: { description: "Category created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateCategorySchema,
                detail: {
                    summary: "Update category",
                    responses: { 200: { description: "Category updated" }, 404: { description: "Category not found" } },
                },
            })
            .delete("/:id", ({ params, user }) => controller.delete(user.id, params.id), {
                detail: {
                    summary: "Delete category",
                    responses: {
                        200: { description: "Category deleted" },
                        404: { description: "Category not found" },
                        409: { description: "Category is in use by subcategories or transactions" },
                    },
                },
            }),
    )
