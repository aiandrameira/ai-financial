export type FinancialPlanDebtDto = {
    id: string
    name: string
    outstandingBalance: string
    nextInstallmentAmount: string | null
    nextInstallmentDueDate: string | null
}

export type FinancialPlanGoalDto = {
    id: string
    name: string
    targetAmount: string
    remainingAmount: number
    progressPercent: number
    targetDate: string | null
}

export type FinancialPlanDto = {
    monthlyIncome: string
    fixedExpenses: string
    surplus: string
    debts: FinancialPlanDebtDto[]
    goals: FinancialPlanGoalDto[]
}
