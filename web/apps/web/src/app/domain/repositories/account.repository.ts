import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { AccountFilterDto } from "../schemas";

import type { AccountDto, RequestAccountDto } from "../schemas";

export interface AccountRepository {
    find(filter?: AccountFilterDto): Observable<CursorPaginated<AccountDto>>;
    findAll(filter?: AccountFilterDto): Observable<AccountDto[]>;
    create(input: RequestAccountDto): Observable<AccountDto>;
    update(id: string, input: RequestAccountDto): Observable<void>;
    archive(id: string): Observable<void>;
}

export type { AccountDto };
