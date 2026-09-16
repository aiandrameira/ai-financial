import { Elysia } from "elysia"

import { betterAuthPlugin } from "@/http/plugins/better-auth.plugin"

import {
    createInvestmentAssetSchema,
    createInvestmentMovementSchema,
    createInvestmentPriceSchema,
    findInvestmentAssetsQuerySchema,
    findInvestmentMovementsQuerySchema,
    findInvestmentPricesQuerySchema,
    updateInvestmentAssetSchema,
} from "../../app/schemas"
import {
    CreateInvestmentAssetUseCase,
    CreateInvestmentMovementUseCase,
    CreateInvestmentPriceUseCase,
    DeleteInvestmentAssetUseCase,
    DeleteInvestmentMovementUseCase,
    FindInvestmentAssetsUseCase,
    FindInvestmentMovementsUseCase,
    FindInvestmentPricesUseCase,
    GetInvestmentAssetUseCase,
    UpdateInvestmentAssetUseCase,
} from "../../app/usecases"
import { InvestmentController } from "../controllers/investment.controller"
import { InvestmentAssetDrizzleRepository } from "../repositories/investment-asset.drizzle"
import { InvestmentMovementDrizzleRepository } from "../repositories/investment-movement.drizzle"
import { InvestmentPriceDrizzleRepository } from "../repositories/investment-price.drizzle"

function buildController() {
    const assetRepository = new InvestmentAssetDrizzleRepository()
    const movementRepository = new InvestmentMovementDrizzleRepository()
    const priceRepository = new InvestmentPriceDrizzleRepository()

    return new InvestmentController({
        find: new FindInvestmentAssetsUseCase(assetRepository),
        get: new GetInvestmentAssetUseCase(assetRepository),
        create: new CreateInvestmentAssetUseCase(assetRepository),
        update: new UpdateInvestmentAssetUseCase(assetRepository),
        delete: new DeleteInvestmentAssetUseCase(assetRepository),
        findMovements: new FindInvestmentMovementsUseCase(movementRepository, assetRepository),
        createMovement: new CreateInvestmentMovementUseCase(movementRepository, assetRepository),
        deleteMovement: new DeleteInvestmentMovementUseCase(movementRepository),
        findPrices: new FindInvestmentPricesUseCase(priceRepository, assetRepository),
        createPrice: new CreateInvestmentPriceUseCase(priceRepository, assetRepository),
    })
}

const controller = buildController()

export const investmentRoutes = new Elysia({ prefix: "/investments", tags: ["Investments"] })
    .use(betterAuthPlugin)
    .guard({ auth: true }, app =>
        app
            .get("/", ({ query, user }) => controller.find(user.id, query), {
                query: findInvestmentAssetsQuerySchema,
                detail: {
                    summary: "List investment assets",
                    description:
                        "Includes computed position (quantity, average price, invested amount, current value, profit/loss) derived from movements and the latest manual price.",
                    responses: { 200: { description: "Cursor-paginated list of investment assets" } },
                },
            })
            .get("/:id", ({ params, user }) => controller.get(user.id, params.id), {
                detail: {
                    summary: "Get investment asset",
                    responses: {
                        200: { description: "Investment asset found" },
                        404: { description: "Investment asset not found" },
                    },
                },
            })
            .post(
                "/",
                ({ body, set, user }) => {
                    set.status = 201
                    return controller.create(user.id, body)
                },
                {
                    body: createInvestmentAssetSchema,
                    detail: {
                        summary: "Create investment asset",
                        responses: { 201: { description: "Investment asset created" } },
                    },
                },
            )
            .put("/:id", ({ params, body, user }) => controller.update(user.id, params.id, body), {
                body: updateInvestmentAssetSchema,
                detail: {
                    summary: "Update investment asset",
                    responses: {
                        200: { description: "Investment asset updated" },
                        404: { description: "Investment asset not found" },
                    },
                },
            })
            .delete("/:id", ({ params, user }) => controller.delete(user.id, params.id), {
                detail: {
                    summary: "Delete investment asset",
                    description: "Cascades to delete all of its movements and price history.",
                    responses: {
                        200: { description: "Investment asset deleted" },
                        404: { description: "Investment asset not found" },
                    },
                },
            })
            .get("/:id/movements", ({ params, query, user }) => controller.findMovements(user.id, params.id, query), {
                query: findInvestmentMovementsQuerySchema,
                detail: {
                    summary: "List investment movements",
                    responses: {
                        200: { description: "Cursor-paginated list of movements" },
                        404: { description: "Investment asset not found" },
                    },
                },
            })
            .post(
                "/:id/movements",
                ({ params, body, set, user }) => {
                    set.status = 201
                    return controller.createMovement(user.id, params.id, body)
                },
                {
                    body: createInvestmentMovementSchema,
                    detail: {
                        summary: "Create investment movement",
                        description:
                            "Buy/contribution increase the position; sell/withdrawal decrease it and are rejected if they exceed the current quantity.",
                        responses: {
                            201: { description: "Movement created" },
                            400: { description: "Quantity exceeds current position" },
                            404: { description: "Investment asset not found" },
                        },
                    },
                },
            )
            .delete(
                "/:id/movements/:movementId",
                ({ params, user }) => controller.deleteMovement(user.id, params.id, params.movementId),
                {
                    detail: {
                        summary: "Delete investment movement",
                        responses: { 200: { description: "Movement deleted" }, 404: { description: "Movement not found" } },
                    },
                },
            )
            .get("/:id/prices", ({ params, query, user }) => controller.findPrices(user.id, params.id, query), {
                query: findInvestmentPricesQuerySchema,
                detail: {
                    summary: "List investment price history",
                    responses: {
                        200: { description: "Cursor-paginated list of prices" },
                        404: { description: "Investment asset not found" },
                    },
                },
            })
            .post(
                "/:id/prices",
                ({ params, body, set, user }) => {
                    set.status = 201
                    return controller.createPrice(user.id, params.id, body)
                },
                {
                    body: createInvestmentPriceSchema,
                    detail: {
                        summary: "Add a manual price point",
                        description:
                            "Used as the current value reference for the asset until an automatic quote source is added (future phase).",
                        responses: {
                            201: { description: "Price added" },
                            404: { description: "Investment asset not found" },
                        },
                    },
                },
            ),
    )
