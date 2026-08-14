import type { Observable } from "rxjs";

import type { AccountDto, RequestAccountDto } from "../schemas";

export interface AccountRepository {
    find(): Observable<AccountDto[]>;
    create(input: RequestAccountDto): Observable<AccountDto>;
    update(id: string, input: RequestAccountDto): Observable<void>;
}

export type { AccountDto };
