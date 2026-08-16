export type SavingsGoalDto = {
    id: string
    name: string
    targetAmount: string
    targetDate: string | null
    icon: string | null
    linkedAccountId: string | null
    currentAmount: number
    remainingAmount: number
    progressPercent: number
    createdAt: string
    updatedAt: string
}
