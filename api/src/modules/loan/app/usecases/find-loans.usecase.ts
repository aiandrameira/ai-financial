import type { ICursorPaginated } from "@/http/api/response"

import type { LoanDto } from "../dtos"
import type { FindLoansQuery } from "../schemas"
import type { LoanRepository } from "../../domain/repositories"

export class FindLoansUseCase {
    constructor(private repository: LoanRepository) {}

    async execute(userId: string, params: FindLoansQuery): Promise<ICursorPaginated<LoanDto>> {
        return this.repository.find(userId, params)
    }
}
