import { Elysia } from "elysia"

import { env } from "@/env"
import { paginationQuerySchema } from "@/http/api/schema/schemas"

import { createCategorySchema, updateCategorySchema } from "../../app/schemas/category.schema"
import { CreateCategoryUseCase } from "../../app/usecases/create-category.usecase"
import { DeleteCategoryUseCase } from "../../app/usecases/delete-category.usecase"
import { FindCategoriesUseCase } from "../../app/usecases/find-categories.usecase"
import { GetCategoryUseCase } from "../../app/usecases/get-category.usecase"
import { UpdateCategoryUseCase } from "../../app/usecases/update-category.usecase"
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
        query: paginationQuerySchema,
        detail: {
            summary: "List categories",
            responses: { 200: { description: "Lista paginada de categorias" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get category",
            responses: {
                200: { description: "Categoria encontrada" },
                404: { description: "Categoria não encontrada" },
            },
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
                responses: { 201: { description: "Categoria criada" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateCategorySchema,
        detail: {
            summary: "Update category",
            responses: {
                200: { description: "Categoria atualizada" },
                404: { description: "Categoria não encontrada" },
            },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete category",
            responses: {
                200: { description: "Categoria excluída" },
                404: { description: "Categoria não encontrada" },
                409: { description: "Categoria em uso por subcategorias ou transações" },
            },
        },
    })
