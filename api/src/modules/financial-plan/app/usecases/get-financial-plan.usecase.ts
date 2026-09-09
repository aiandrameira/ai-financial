import { stTransactionEnum } from "@/modules/transaction/domain/enums/st-transaction.enum"
import { tpTransactionEnum } from "@/modules/transaction/domain/enums/tp-transaction.enum"
import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import type { LoanInstallmentRepository, LoanRepository } from "@/modules/loan/domain/repositories"
import type { SavingsGoalRepository } from "@/modules/savings-goal/domain/repositories"
import type { FinancialSettingsRepository } from "@/modules/financial-settings/domain/repositories"

import type { FinancialPlanDebtDto, FinancialPlanDto, FinancialPlanGoalDto } from "../dtos"

function monthRange(reference: Date): { start: Date; end: Date } {
    const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1))
    const end = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1))
    return { start, end }
}

export class GetFinancialPlanUseCase {
    constructor(
        private settingsRepository: FinancialSettingsRepository,
        private transactionRepository: TransactionRepository,
        private loanRepository: LoanRepository,
        private loanInstallmentRepository: LoanInstallmentRepository,
        private savingsGoalRepository: SavingsGoalRepository,
    ) {}

    async execute(userId: string): Promise<FinancialPlanDto> {
        const { start, end } = monthRange(new Date())

        const [settings, expenses, loans, goals] = await Promise.all([
            this.settingsRepository.get(userId),
            this.transactionRepository.find(userId, {
                type: tpTransactionEnum.EXPENSE,
                dateFrom: start,
                dateTo: end,
                limit: 100,
                includeTotal: false,
            }),
            this.loanRepository.find(userId, { limit: 100, includeTotal: false }),
            this.savingsGoalRepository.find(userId, { limit: 100, includeTotal: false }),
        ])

        const monthlyIncome = settings?.monthlyIncome ?? "0.00"

        const fixedExpenses = expenses.data
            .filter((transaction) => transaction.status !== stTransactionEnum.CANCELLED)
            .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0)

        const activeLoans = loans.data.filter((loan) => Number(loan.outstandingBalance) > 0)
        const debts: FinancialPlanDebtDto[] = await Promise.all(
            activeLoans.map(async (loan) => {
                const nextInstallment = await this.loanInstallmentRepository.findNextUnpaid(userId, loan.id)
                return {
                    id: loan.id,
                    name: loan.name,
                    outstandingBalance: loan.outstandingBalance,
                    nextInstallmentAmount: nextInstallment?.amount ?? null,
                    nextInstallmentDueDate: nextInstallment?.dueDate ?? null,
                }
            }),
        )

        const activeGoals: FinancialPlanGoalDto[] = goals.data
            .filter((goal) => goal.remainingAmount > 0)
            .map((goal) => ({
                id: goal.id,
                name: goal.name,
                targetAmount: goal.targetAmount,
                remainingAmount: goal.remainingAmount,
                progressPercent: goal.progressPercent,
                targetDate: goal.targetDate,
            }))

        const minimumDebtPayments = debts.reduce(
            (total, debt) => total + Number(debt.nextInstallmentAmount ?? 0),
            0,
        )
        const surplus = Number(monthlyIncome) - fixedExpenses - minimumDebtPayments

        return {
            monthlyIncome,
            fixedExpenses: fixedExpenses.toFixed(2),
            surplus: surplus.toFixed(2),
            debts,
            goals: activeGoals,
        }
    }
}
