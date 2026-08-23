import { Elysia } from "elysia"

import { env } from "@/env"

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
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findCategoriesQuerySchema,
        detail: {
            summary: "List categories",
            responses: { 200: { description: "Cursor-paginated list of categories" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get category",
            responses: { 200: { description: "Category found" }, 404: { description: "Category not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createCategorySchema,
            detail: {
                summary: "Create category",
                responses: { 201: { description: "Category created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateCategorySchema,
        detail: {
            summary: "Update category",
            responses: { 200: { description: "Category updated" }, 404: { description: "Category not found" } },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete category",
            responses: {
                200: { description: "Category deleted" },
                404: { description: "Category not found" },
                409: { description: "Category is in use by subcategories or transactions" },
            },
        },
    })
