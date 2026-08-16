import { inject, Injectable, signal } from "@angular/core";
import { finalize, Observable, tap } from "rxjs";

import type { CreditCardInvoiceDto, TransactionDto } from "@domain/schemas";
import { CreditCardInvoiceService, TransactionService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class CreditCardInvoiceFacade {
    #invoiceService = inject(CreditCardInvoiceService);
    #transactionService = inject(TransactionService);

    #invoices = signal<CreditCardInvoiceDto[]>([]);
    readonly invoices = this.#invoices.asReadonly();

    #invoiceTransactions = signal<TransactionDto[]>([]);
    readonly invoiceTransactions = this.#invoiceTransactions.asReadonly();

    #loading = signal(false);
    readonly loading = this.#loading.asReadonly();

    #loadingTransactions = signal(false);
    readonly loadingTransactions = this.#loadingTransactions.asReadonly();

    loadInvoices(creditCardId: string): void {
        this.#loading.set(true);
        this.#invoiceService
            .find(creditCardId)
            .pipe(finalize(() => this.#loading.set(false)))
            .subscribe(invoices => this.#invoices.set(invoices));
    }

    loadInvoiceTransactions(invoiceId: string): void {
        this.#loadingTransactions.set(true);
        this.#transactionService
            .find({ invoiceId })
            .pipe(finalize(() => this.#loadingTransactions.set(false)))
            .subscribe(transactions => this.#invoiceTransactions.set(transactions));
    }

    payInvoice(creditCardId: string, invoiceId: string): Observable<void> {
        return this.#invoiceService.pay(creditCardId, invoiceId).pipe(tap(() => this.loadInvoices(creditCardId)));
    }
}
