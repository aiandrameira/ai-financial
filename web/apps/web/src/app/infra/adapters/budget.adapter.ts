import { BudgetDto, RequestBudgetDto } from "@domain/schemas";

export class BudgetAdapter {
    static toDto(raw: BudgetDto): RequestBudgetDto {
        return {
            id: raw.id,
            categoryId: raw.categoryId,
            referenceMonth: raw.referenceMonth.slice(0, 10),
            plannedAmount: Number(raw.plannedAmount),
        };
    }
}
