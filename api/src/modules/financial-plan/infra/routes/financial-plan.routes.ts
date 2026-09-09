import { Elysia } from "elysia"

import { env } from "@/env"
import { FinancialSettingsDrizzleRepository } from "@/modules/financial-settings/infra/repositories/financial-settings.drizzle"
import { LoanInstallmentDrizzleRepository } from "@/modules/loan/infra/repositories/loan-installment.drizzle"
import { LoanDrizzleRepository } from "@/modules/loan/infra/repositories/loan.drizzle"
import { SavingsGoalDrizzleRepository } from "@/modules/savings-goal/infra/repositories/savings-goal.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

import { GetFinancialPlanUseCase } from "../../app/usecases"
import { FinancialPlanController } from "../controllers/financial-plan.controller"

function buildController() {
    return new FinancialPlanController({
        get: new GetFinancialPlanUseCase(
            new FinancialSettingsDrizzleRepository(),
            new TransactionDrizzleRepository(),
            new LoanDrizzleRepository(),
            new LoanInstallmentDrizzleRepository(),
            new SavingsGoalDrizzleRepository(),
        ),
    })
}

const controller = buildController()

export const financialPlanRoutes = new Elysia({ prefix: "/financial-plan", tags: ["Financial Plan"] }).get(
    "/",
    () => controller.get(env.DEV_USER_ID),
    {
        detail: {
            summary: "Get the financial plan overview",
            description:
                "Aggregates monthly income, current-month fixed expenses, active debts (with next installment) and active savings goals, plus the computed monthly surplus. No allocation is suggested — the numbers only.",
            responses: { 200: { description: "Financial plan overview" } },
        },
    },
)
