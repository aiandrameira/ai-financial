import { env } from "@/env"

import type { GoalReachedNotifier } from "../../domain/services"

export class AiFlowGoalReachedNotifier implements GoalReachedNotifier {
    async notify(userId: string, goal: { id: string; name: string; progressPercent: number }): Promise<void> {
        if (!env.AI_FLOW_API_URL || !env.AI_FLOW_API_KEY) return

        const response = await fetch(`${env.AI_FLOW_API_URL}/events`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.AI_FLOW_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "savings_goal.reached",
                externalId: goal.id,
                data: { goalId: goal.id, goalName: goal.name, userId, percentReached: goal.progressPercent },
            }),
        })

        if (!response.ok) {
            console.error(
                `[goal-reached-notifier] falha ao notificar AI Flow para a meta ${goal.id}: ${response.status}`,
            )
        }
    }
}
