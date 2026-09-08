import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { InvestmentFilterDto } from "../schemas";

import type { InvestmentAssetDto, RequestInvestmentAssetDto } from "../schemas";

export interface InvestmentRepository {
    find(filter?: InvestmentFilterDto): Observable<CursorPaginated<InvestmentAssetDto>>;
    findAll(filter?: InvestmentFilterDto): Observable<InvestmentAssetDto[]>;
    get(id: string): Observable<InvestmentAssetDto>;
    create(input: RequestInvestmentAssetDto): Observable<InvestmentAssetDto>;
    update(id: string, input: RequestInvestmentAssetDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { InvestmentAssetDto };
