import { openapi } from "@elysia/openapi"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"

import { env } from "./env"
import { ApiResponse } from "./http/api/response"
import { uploadRoutes } from "./http/uploads/uploads.routes"

const start = async () => {
    const app = new Elysia()
        .use(cors({ origin: env.FRONT_URLS }))
        .use(openapi())
        .onError(({ error, set }) => {
            const status = "status" in error && typeof error.status === "number" ? error.status : 500
            set.status = status
            return ApiResponse.error("message" in error ? error.message : "Internal server error", status)
        })
        .get("/health", () => ApiResponse.success("ok"))
        .use(uploadRoutes)
        .listen(env.PORT)

    console.log(`💰 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
    console.log(` 📚 OpenAPI documentation available at ${app.server?.hostname}:${app.server?.port}/openapi`)
}

start()
