export enum tpRecurrenceFrequencyEnum {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly",
}

export const tpRecurrenceFrequencyMap = new Map<tpRecurrenceFrequencyEnum, string>([
    [tpRecurrenceFrequencyEnum.DAILY, "Diária"],
    [tpRecurrenceFrequencyEnum.WEEKLY, "Semanal"],
    [tpRecurrenceFrequencyEnum.MONTHLY, "Mensal"],
    [tpRecurrenceFrequencyEnum.YEARLY, "Anual"],
]);
