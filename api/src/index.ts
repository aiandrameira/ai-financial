import { openapi } from "@elysia/openapi"
import cors from "@elysiajs/cors"
import { Elysia } from "elysia"

import { env } from "./env"
import { ApiResponse } from "./http/api/response"
import { uploadRoutes } from "./http/uploads/uploads.routes"
import { notifyDueInstallmentsJob } from "./jobs/notify-due-installments.job"
import { notifyDueInvoicesJob } from "./jobs/notify-due-invoices.job"
import { accountRoutes } from "./modules/account/infra/routes/account.routes"
import { assetRoutes } from "./modules/asset/infra/routes/asset.routes"
import { budgetRoutes } from "./modules/budget/infra/routes/budget.routes"
import { categoryRoutes } from "./modules/category/infra/routes/category.routes"
import { creditCardRoutes } from "./modules/credit-card/infra/routes/credit-card.routes"
import { creditCardInvoiceRoutes } from "./modules/credit-card-invoice/infra/routes/credit-card-invoice.routes"
import { investmentRoutes } from "./modules/investment/infra/routes/investment.routes"
import { loanRoutes } from "./modules/loan/infra/routes/loan.routes"
import { savingsGoalRoutes } from "./modules/savings-goal/infra/routes/savings-goal.routes"
import { transactionRoutes } from "./modules/transaction/infra/routes/transaction.routes"

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
        .use(notifyDueInvoicesJob)
        .use(notifyDueInstallmentsJob)
        .use(accountRoutes)
        .use(assetRoutes)
        .use(budgetRoutes)
        .use(categoryRoutes)
        .use(creditCardRoutes)
        .use(creditCardInvoiceRoutes)
        .use(investmentRoutes)
        .use(loanRoutes)
        .use(savingsGoalRoutes)
        .use(transactionRoutes)
        .listen(env.PORT)

    console.log(`💰 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
    console.log(` 📚 OpenAPI documentation available at ${app.server?.hostname}:${app.server?.port}/openapi`)
}

start()
