import type { tpCategoryEnum, tpTransactionEnum } from "@domain/enums";

export function matchesCategoryType(categoryType: tpCategoryEnum, transactionType: tpTransactionEnum): boolean {
    return (categoryType as string) === (transactionType as string);
}
