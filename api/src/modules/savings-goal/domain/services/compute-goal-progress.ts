export type GoalProgress = {
    currentAmount: number
    remainingAmount: number
    progressPercent: number
}

function round2(value: number): number {
    return Math.round(value * 100) / 100
}

export function computeGoalProgress(targetAmount: number, contributionAmounts: number[]): GoalProgress {
    const currentAmount = round2(contributionAmounts.reduce((sum, amount) => sum + amount, 0))
    const remainingAmount = round2(Math.max(0, targetAmount - currentAmount))
    const progressPercent = targetAmount > 0 ? round2(Math.min(100, (currentAmount / targetAmount) * 100)) : 0

    return { currentAmount, remainingAmount, progressPercent }
}
