import { Elysia } from "elysia"

import { env } from "@/env"
import { AccountDrizzleRepository } from "@/modules/account/infra/repositories/account.drizzle"
import { TransactionDrizzleRepository } from "@/modules/transaction/infra/repositories/transaction.drizzle"

import {
    createLoanSchema,
    findLoanInstallmentsQuerySchema,
    findLoansQuerySchema,
    payLoanInstallmentSchema,
    updateLoanSchema,
} from "../../app/schemas"
import {
    CreateLoanUseCase,
    DeleteLoanUseCase,
    FindLoanInstallmentsUseCase,
    FindLoansUseCase,
    GetLoanUseCase,
    PayLoanInstallmentUseCase,
    UpdateLoanUseCase,
} from "../../app/usecases"
import { LoanController } from "../controllers/loan.controller"
import { LoanInstallmentDrizzleRepository } from "../repositories/loan-installment.drizzle"
import { LoanDrizzleRepository } from "../repositories/loan.drizzle"

function buildController() {
    const repository = new LoanDrizzleRepository()
    const installmentRepository = new LoanInstallmentDrizzleRepository()
    const accountRepository = new AccountDrizzleRepository()
    const transactionRepository = new TransactionDrizzleRepository()

    return new LoanController({
        find: new FindLoansUseCase(repository),
        get: new GetLoanUseCase(repository),
        create: new CreateLoanUseCase(repository, accountRepository),
        update: new UpdateLoanUseCase(repository, accountRepository),
        delete: new DeleteLoanUseCase(repository),
        findInstallments: new FindLoanInstallmentsUseCase(installmentRepository, repository),
        payInstallment: new PayLoanInstallmentUseCase(installmentRepository, repository, transactionRepository),
    })
}

const controller = buildController()

export const loanRoutes = new Elysia({ prefix: "/loans", tags: ["Loans"] })
    .get("/", ({ query }) => controller.find(env.DEV_USER_ID, query), {
        query: findLoansQuerySchema,
        detail: {
            summary: "List loans",
            description: "Includes computed outstanding balance based on paid installments.",
            responses: { 200: { description: "Cursor-paginated list of loans" } },
        },
    })
    .get("/:id", ({ params }) => controller.get(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Get loan",
            responses: { 200: { description: "Loan found" }, 404: { description: "Loan not found" } },
        },
    })
    .post(
        "/",
        ({ body, set }) => {
            set.status = 201
            return controller.create(env.DEV_USER_ID, body)
        },
        {
            body: createLoanSchema,
            detail: {
                summary: "Create loan",
                description: "Generates the full amortization schedule (Price/French system) atomically.",
                responses: { 201: { description: "Loan created" } },
            },
        },
    )
    .put("/:id", ({ params, body }) => controller.update(env.DEV_USER_ID, params.id, body), {
        body: updateLoanSchema,
        detail: {
            summary: "Update loan",
            description:
                "Only name, type and account can be changed — financial terms are fixed once the amortization schedule is generated.",
            responses: { 200: { description: "Loan updated" }, 404: { description: "Loan or account not found" } },
        },
    })
    .delete("/:id", ({ params }) => controller.delete(env.DEV_USER_ID, params.id), {
        detail: {
            summary: "Delete loan",
            description: "Cascades to delete all of its installments.",
            responses: { 200: { description: "Loan deleted" }, 404: { description: "Loan not found" } },
        },
    })
    .get("/:id/installments", ({ params, query }) => controller.findInstallments(env.DEV_USER_ID, params.id, query), {
        query: findLoanInstallmentsQuerySchema,
        detail: {
            summary: "List loan installments",
            responses: { 200: { description: "Cursor-paginated list of installments" } },
        },
    })
    .post(
        "/:id/installments/:installmentId/pay",
        ({ params, body }) => controller.payInstallment(env.DEV_USER_ID, params.id, params.installmentId, body),
        {
            body: payLoanInstallmentSchema,
            detail: {
                summary: "Pay a loan installment",
                description:
                    "Creates a settlement transaction on the loan's associated account and marks the installment as paid.",
                responses: {
                    200: { description: "Installment paid" },
                    404: { description: "Installment not found" },
                    409: { description: "Installment already paid" },
                },
            },
        },
    )
