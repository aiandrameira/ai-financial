import { Elysia } from "elysia"

import { env } from "@/env"
import { AccountDrizzleRepository } from "@/modules/account/infra/repositories/account.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

import {
    createGoalContributionSchema,
    createSavingsGoalSchema,
    findGoalContributionsQuerySchema,
    findSavingsGoalsQuerySchema,
    updateSavingsGoalSchema,
} from "../../app/schemas"
import {
    CreateGoalContributionUseCase,
    CreateSavingsGoalUseCase,
    DeleteGoalContributionUseCase,
    DeleteSavingsGoalUseCase,
    FindGoalContributionsUseCase,
    FindSavingsGoalsUseCase,
    GetSavingsGoalUseCase,
    UpdateSavingsGoalUseCase,
} from "../../app/usecases"
import { SavingsGoalController } from "../controllers/savings-goal.controller"
import { GoalContributionDrizzleRepository } from "../repositories/goal-contribution.drizzle"
import { SavingsGoalDrizzleRepository } from "../repositories/savings-goal.drizzle"

function buildController() {
    const repository = new SavingsGoalDrizzleRepository()
    const contributionRepository = new GoalContributionDrizzleRepository()
    const accountRepository = new AccountDrizzleRepository()
    const transactionRepository = new TransactionDrizzleRepository()

    return new SavingsGoalController({
        find: new FindSavingsGoalsUseCase(repository),
        get: new GetSavingsGoalUseCase(repository),
        create: new CreateSavingsGoalUseCase(repository, accountRepository),
        update: new UpdateSavingsGoalUseCase(repository, accountRepository),
        delete: new DeleteSavingsGoalUseCase(repository),
        findContributions: new FindGoalContributionsUseCase(contributionRepository, repository),
        createContribution: new CreateGoalContributionUseCase(contributionRepository, repository, transactionRepository),
        deleteContribution: new DeleteGoalContributionUseCase(contributionRepository),
    })
}

const controller = buildController()

export const savingsGoalRoutes = new Elysia({ prefix: "/goals", tags: ["Savings Goals"] })
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findSavingsGoalsQuerySchema,
        detail: {
            summary: "List savings goals",
            description: "Includes computed progress (current amount, remaining amount, percent) derived from contributions.",
            responses: { 200: { description: "Paginated list of savings goals" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get savings goal",
            responses: { 200: { description: "Savings goal found" }, 404: { description: "Savings goal not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createSavingsGoalSchema,
            detail: {
                summary: "Create savings goal",
                responses: { 201: { description: "Savings goal created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateSavingsGoalSchema,
        detail: {
            summary: "Update savings goal",
            responses: { 200: { description: "Savings goal updated" }, 404: { description: "Savings goal not found" } },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete savings goal",
            description: "Cascades to delete all of its contributions.",
            responses: { 200: { description: "Savings goal deleted" }, 404: { description: "Savings goal not found" } },
        },
    })
    .get("/:id/contributions", ({ params, query }) => controller.findContributions(env.DEV_USER_ID, params.id, query), {
        query: findGoalContributionsQuerySchema,
        detail: {
            summary: "List goal contributions",
            responses: { 200: { description: "Paginated list of contributions" }, 404: { description: "Savings goal not found" } },
        },
    })
    .post(
        "/:id/contributions",
        ({ params, body, set }) => {
            set.status = 201
            return controller.createContribution(env.DEV_USER_ID, params.id, body)
        },
        {
            body: createGoalContributionSchema,
            detail: {
                summary: "Add a contribution",
                description: "Optionally references the transaction that actually moved the money.",
                responses: { 201: { description: "Contribution added" }, 404: { description: "Savings goal or transaction not found" } },
            },
        },
    )
    .delete("/:id/contributions/:contributionId", ({ params }) => controller.deleteContribution(env.DEV_USER_ID, params.id, params.contributionId), {
        detail: {
            summary: "Delete a contribution",
            responses: { 200: { description: "Contribution deleted" }, 404: { description: "Contribution not found" } },
        },
    })
