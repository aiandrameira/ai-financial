import { RequestSavingsGoalDto, SavingsGoalDto } from "@domain/schemas";

export class SavingsGoalAdapter {
    static toDto(raw: SavingsGoalDto): RequestSavingsGoalDto {
        return {
            id: raw.id,
            name: raw.name,
            targetAmount: Number(raw.targetAmount),
            targetDate: raw.targetDate?.slice(0, 10) ?? "",
            icon: raw.icon ?? "shield-check",
            linkedAccountId: raw.linkedAccountId ?? "",
        };
    }
}
