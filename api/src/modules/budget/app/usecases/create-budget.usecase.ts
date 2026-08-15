import type { CategoryRepository } from "@/modules/category/domain/repositories"
import { tpCategoryEnum } from "@/modules/category/domain/enums/tp-category.enum"
import { ConflictError, NotFoundError, ValidationError } from "@/http/errors/errors"

import type { BudgetDto } from "../dtos"
import type { CreateBudgetSchema } from "../schemas"
import type { BudgetRepository } from "../../domain/repositories"

export class CreateBudgetUseCase {
    constructor(
        private repository: BudgetRepository,
        private categoryRepository: CategoryRepository,
    ) {}

    async execute(userId: string, body: CreateBudgetSchema): Promise<BudgetDto> {
        const category = await this.categoryRepository.get(userId, body.categoryId)
        if (!category) throw new NotFoundError("Category not found")
        if (category.type !== tpCategoryEnum.EXPENSE) {
            throw new ValidationError("Budgets can only be created for expense categories")
        }

        const referenceMonth = new Date(Date.UTC(body.referenceMonth.getUTCFullYear(), body.referenceMonth.getUTCMonth(), 1))

        const existing = await this.repository.getByCategoryAndMonth(userId, body.categoryId, referenceMonth)
        if (existing) throw new ConflictError("A budget already exists for this category and month")

        return this.repository.create(userId, { ...body, referenceMonth })
    }
}
