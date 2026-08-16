import { Elysia } from "elysia"

import { env } from "@/env"

import { createAssetSchema, findAssetsQuerySchema, updateAssetSchema } from "../../app/schemas"
import { CreateAssetUseCase, DeleteAssetUseCase, FindAssetsUseCase, GetAssetUseCase, UpdateAssetUseCase } from "../../app/usecases"
import { AssetController } from "../controllers/asset.controller"
import { AssetDrizzleRepository } from "../repositories/asset.drizzle"

function buildController() {
    const repository = new AssetDrizzleRepository()

    return new AssetController({
        find: new FindAssetsUseCase(repository),
        get: new GetAssetUseCase(repository),
        create: new CreateAssetUseCase(repository),
        update: new UpdateAssetUseCase(repository),
        delete: new DeleteAssetUseCase(repository),
    })
}

const controller = buildController()

export const assetRoutes = new Elysia({ prefix: "/assets", tags: ["Assets"] })
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findAssetsQuerySchema,
        detail: {
            summary: "List assets",
            description: "Assets used to reflect net worth alongside linked debts (e.g. a financed vehicle or property).",
            responses: { 200: { description: "Paginated list of assets" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get asset",
            responses: { 200: { description: "Asset found" }, 404: { description: "Asset not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createAssetSchema,
            detail: {
                summary: "Create asset",
                responses: { 201: { description: "Asset created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateAssetSchema,
        detail: {
            summary: "Update asset",
            responses: { 200: { description: "Asset updated" }, 404: { description: "Asset not found" } },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete asset",
            responses: { 200: { description: "Asset deleted" }, 404: { description: "Asset not found" } },
        },
    })
