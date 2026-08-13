import type { tpCategoryEnum } from "@/modules/category/domain/enums"

import type { tpTransactionEnum } from "../enums/tp-transaction.enum"

export function matchesCategoryType(categoryType: tpCategoryEnum, transactionType: tpTransactionEnum): boolean {
    return (categoryType as string) === (transactionType as string)
}
