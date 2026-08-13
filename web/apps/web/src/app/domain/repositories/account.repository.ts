import type { Observable } from "rxjs";

import type { AccountDto, CreateAccount } from "../schemas";

export interface AccountRepository {
    find(): Observable<AccountDto[]>;
    create(input: CreateAccount): Observable<AccountDto>;
}

export type { AccountDto };
