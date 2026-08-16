export type GoalContributionDto = {
    id: string
    goalId: string
    transactionId: string | null
    amount: string
    date: string
    createdAt: string
}
