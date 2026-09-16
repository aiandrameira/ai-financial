import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

import { createAssetSchema, findAssetsQuerySchema, updateAssetSchema } from "../../app/schemas"
import {
    CreateAssetUseCase,
    DeleteAssetUseCase,
    FindAssetsUseCase,
    GetAssetUseCase,
    UpdateAssetUseCase,
} from "../../app/usecases"
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
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findAssetsQuerySchema,
                detail: {
                    summary: "List assets",
                    description:
                        "Assets used to reflect net worth alongside linked debts (e.g. a financed vehicle or property).",
                    responses: { 200: { description: "Cursor-paginated list of assets" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get asset",
                    responses: { 200: { description: "Asset found" }, 404: { description: "Asset not found" } },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createAssetSchema,
                    detail: {
                        summary: "Create asset",
                        responses: { 201: { description: "Asset created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateAssetSchema,
                detail: {
                    summary: "Update asset",
                    responses: { 200: { description: "Asset updated" }, 404: { description: "Asset not found" } },
                },
            })
            .delete("/:id", ({ params, user }) => controller.delete(user.id, params.id), {
                detail: {
                    summary: "Delete asset",
                    responses: { 200: { description: "Asset deleted" }, 404: { description: "Asset not found" } },
                },
            }),
    )
