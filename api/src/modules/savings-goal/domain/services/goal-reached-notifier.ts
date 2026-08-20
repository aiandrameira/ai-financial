export interface GoalReachedNotifier {
    notify(userId: string, goal: { id: string; name: string; progressPercent: number }): Promise<void>
}
