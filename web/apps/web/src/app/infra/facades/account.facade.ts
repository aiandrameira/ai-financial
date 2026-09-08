import { computed, inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable, tap } from "rxjs";

import { CursorPaginationState, DEFAULT_PAGE_SIZE, emptyCursorPage, toLastGoodCursorPage } from "@core/ui";
import { AccountDto, AccountFilterDto, RequestAccountDto } from "@domain/schemas";
import { AccountService } from "@infra/services";

const EMPTY_LIST = emptyCursorPage<AccountDto>(DEFAULT_PAGE_SIZE);

@Injectable({ providedIn: "root" })
export class AccountFacade extends CursorPaginationState {
    #service = inject(AccountService);
    #filter = signal<AccountFilterDto>({});

    #listResource = rxResource({
        params: () => ({ ...this.#filter(), ...this.toQueryParams() }) as AccountFilterDto,
        stream: ({ params }) => this.#service.find(params),
        defaultValue: EMPTY_LIST,
    });
    #page = toLastGoodCursorPage(this.#listResource, EMPTY_LIST);
    readonly accounts = computed(() => this.#page.list().data);

    constructor() {
        super({ getPagination: () => this.#page.list().pagination, isLoading: () => this.#listResource.isLoading() });
    }

    load(filter?: AccountFilterDto): void {
        if (filter) this.setFilter(filter);
        this.reload();
    }

    reload(): void {
        this.reset();
        this.#listResource.reload();
    }

    setFilter(filter: AccountFilterDto): void {
        this.#filter.set(filter);
        this.reset();
    }

    search(query: string): void {
        this.setFilter({ ...this.#filter(), query });
    }

    changeLimit(limit: number): void {
        this.setPageSize(limit);
    }
    next(): void {
        this.goNext();
    }
    previous(): void {
        this.goPrevious();
    }

    create(body: RequestAccountDto): Observable<AccountDto> {
        return this.#service.create(body).pipe(tap(() => this.reload()));
    }

    update(id: string, body: RequestAccountDto): Observable<void> {
        return this.#service.update(id, body).pipe(tap(() => this.reload()));
    }

    archive(id: string): Observable<void> {
        return this.#service.archive(id).pipe(tap(() => this.reload()));
    }
}
