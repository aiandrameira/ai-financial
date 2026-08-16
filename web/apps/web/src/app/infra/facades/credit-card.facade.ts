import { inject, Injectable, signal } from "@angular/core";
import { finalize, forkJoin, Observable, tap } from "rxjs";

import type { AccountDto, CreditCardDto, RequestCreditCardDto } from "@domain/schemas";
import { AccountService, CreditCardService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class CreditCardFacade {
    #creditCardService = inject(CreditCardService);
    #accountService = inject(AccountService);

    #creditCards = signal<CreditCardDto[]>([]);
    readonly creditCards = this.#creditCards.asReadonly();

    #accounts = signal<AccountDto[]>([]);
    readonly accounts = this.#accounts.asReadonly();

    #loading = signal(false);
    readonly loading = this.#loading.asReadonly();

    load(): void {
        this.#loading.set(true);
        forkJoin([this.#creditCardService.find(), this.#accountService.find()])
            .pipe(finalize(() => this.#loading.set(false)))
            .subscribe(([creditCards, accounts]) => {
                this.#creditCards.set(creditCards);
                this.#accounts.set(accounts);
            });
    }

    create(input: RequestCreditCardDto): Observable<CreditCardDto> {
        return this.#creditCardService.create(input).pipe(tap(() => this.load()));
    }

    update(id: string, input: RequestCreditCardDto): Observable<void> {
        return this.#creditCardService.update(id, input).pipe(tap(() => this.load()));
    }

    save(input: RequestCreditCardDto): Observable<unknown> {
        return input.id ? this.update(input.id, input) : this.create(input);
    }

    archive(id: string): Observable<void> {
        return this.#creditCardService.archive(id).pipe(tap(() => this.load()));
    }
}
