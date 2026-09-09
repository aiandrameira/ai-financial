import { describe, expect, mock, test } from "bun:test"

import type { ICursorPaginated } from "@/http/api/response"
import type { FinancialSettingsRepository } from "@/modules/financial-settings/domain/repositories"
import type { LoanInstallmentRepository, LoanRepository } from "@/modules/loan/domain/repositories"
import type { LoanInstallmentDto } from "@/modules/loan/app/dtos"
import type { SavingsGoalRepository } from "@/modules/savings-goal/domain/repositories"
import type { SavingsGoalDto } from "@/modules/savings-goal/app/dtos"
import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import type { TransactionDto } from "@/modules/transaction/app/dtos"
import { stTransactionEnum } from "@/modules/transaction/domain/enums/st-transaction.enum"
import { tpTransactionEnum } from "@/modules/transaction/domain/enums/tp-transaction.enum"

import { GetFinancialPlanUseCase } from "./get-financial-plan.usecase"

function page<T>(data: T[]): ICursorPaginated<T> {
    return { data, pagination: { limit: 100, next: null, prev: null } }
}

function fakeSettings(monthlyIncome: string | null): FinancialSettingsRepository {
    return {
        get: mock(() => Promise.resolve(monthlyIncome === null ? null : { userId: "user-1", monthlyIncome, updatedAt: new Date().toISOString() })),
        upsert: mock(),
    }
}

function fakeTransactions(transactions: Partial<TransactionDto>[]): TransactionRepository {
    return {
        find: mock(() => Promise.resolve(page(transactions as TransactionDto[]))),
        get: mock(),
        findLatestByRecurrence: mock(),
        create: mock(),
        createTransfer: mock(),
        update: mock(),
        delete: mock(),
        deleteTransfer: mock(),
        deleteByInstallmentGroup: mock(),
    }
}

function fakeLoans(loans: { id: string; name: string; outstandingBalance: string }[]): LoanRepository {
    return {
        find: mock(() => Promise.resolve(page(loans))) as unknown as LoanRepository["find"],
        get: mock(),
        createWithInstallments: mock(),
        update: mock(),
        delete: mock(),
    }
}

function fakeLoanInstallments(nextByLoan: Record<string, Partial<LoanInstallmentDto>>): LoanInstallmentRepository {
    return {
        find: mock(),
        get: mock(),
        pay: mock(),
        findDueSoon: mock(),
        findNextUnpaid: mock((_userId: string, loanId: string) =>
            Promise.resolve((nextByLoan[loanId] as LoanInstallmentDto) ?? null),
        ),
    }
}

function fakeGoals(goals: Partial<SavingsGoalDto>[]): SavingsGoalRepository {
    return {
        find: mock(() => Promise.resolve(page(goals as SavingsGoalDto[]))),
        get: mock(),
        create: mock(),
        update: mock(),
        delete: mock(),
    }
}

describe("GetFinancialPlanUseCase", () => {
    test("computes surplus from income, fixed expenses and minimum debt payments", async () => {
        const usecase = new GetFinancialPlanUseCase(
            fakeSettings("5000.00"),
            fakeTransactions([
                { amount: "-800.00", status: stTransactionEnum.COMPLETED, type: tpTransactionEnum.EXPENSE },
                { amount: "-200.00", status: stTransactionEnum.PLANNED, type: tpTransactionEnum.EXPENSE },
                { amount: "-100.00", status: stTransactionEnum.CANCELLED, type: tpTransactionEnum.EXPENSE },
            ]),
            fakeLoans([{ id: "loan-1", name: "Financiamento do carro", outstandingBalance: "10000.00" }]),
            fakeLoanInstallments({ "loan-1": { amount: "500.00", dueDate: "2026-10-05T00:00:00.000Z" } }),
            fakeGoals([{ id: "goal-1", name: "Reforma", targetAmount: "20000.00", remainingAmount: 15000, progressPercent: 25, targetDate: null }]),
        )

        const plan = await usecase.execute("user-1")

        expect(plan.monthlyIncome).toBe("5000.00")
        expect(plan.fixedExpenses).toBe("1000.00")
        expect(plan.debts).toEqual([
            {
                id: "loan-1",
                name: "Financiamento do carro",
                outstandingBalance: "10000.00",
                nextInstallmentAmount: "500.00",
                nextInstallmentDueDate: "2026-10-05T00:00:00.000Z",
            },
        ])
        expect(plan.goals).toEqual([
            { id: "goal-1", name: "Reforma", targetAmount: "20000.00", remainingAmount: 15000, progressPercent: 25, targetDate: null },
        ])
        expect(plan.surplus).toBe("3500.00")
    })

    test("defaults income to zero and excludes settled debts/goals", async () => {
        const usecase = new GetFinancialPlanUseCase(
            fakeSettings(null),
            fakeTransactions([]),
            fakeLoans([{ id: "loan-1", name: "Quitado", outstandingBalance: "0.00" }]),
            fakeLoanInstallments({}),
            fakeGoals([{ id: "goal-1", name: "Já alcançada", targetAmount: "1000.00", remainingAmount: 0, progressPercent: 100, targetDate: null }]),
        )

        const plan = await usecase.execute("user-1")

        expect(plan.monthlyIncome).toBe("0.00")
        expect(plan.fixedExpenses).toBe("0.00")
        expect(plan.debts).toEqual([])
        expect(plan.goals).toEqual([])
        expect(plan.surplus).toBe("0.00")
    })
})
