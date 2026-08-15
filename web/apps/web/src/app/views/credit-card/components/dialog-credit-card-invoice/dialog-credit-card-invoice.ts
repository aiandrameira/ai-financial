import { AI_DIALOG_DATA, AiBadge, AiButton, AiDialogRef, AiIcon, AiToastService } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { formatMonthYearDayjs, formatUtcDateDayjs } from "@core/helpers";
import { stInvoiceEnum, stInvoiceMap } from "@domain/enums";
import { CreditCardInvoiceDto, TransactionDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { CreditCardInvoiceFacade } from "@infra/facades";
import { TransactionService } from "@infra/services";

const STATUS_VARIANT: Record<stInvoiceEnum, BadgeVariant> = {
    [stInvoiceEnum.OPEN]: "info",
    [stInvoiceEnum.CLOSED]: "warning",
    [stInvoiceEnum.PAID]: "success",
};

@Component({
    selector: "ai-dialog-credit-card-invoice",
    imports: [AiBadge, AiButton, AiIcon, CurrencyPipe, DatePipe],
    templateUrl: "./dialog-credit-card-invoice.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreditCardInvoice implements OnInit {
    #facade = inject(CreditCardInvoiceFacade);
    #transactionService = inject(TransactionService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogCreditCardInvoice>);

    protected readonly data = inject<{ creditCardId: string; invoice: CreditCardInvoiceDto }>(AI_DIALOG_DATA as never);

    protected readonly statusVariant = STATUS_VARIANT;
    protected readonly stInvoiceMap = stInvoiceMap;
    protected readonly stInvoiceEnum = stInvoiceEnum;
    protected readonly referenceMonthLabel = computed(() => formatMonthYearDayjs(this.data.invoice.referenceMonth));
    protected readonly closingDateLabel = computed(() => formatUtcDateDayjs(this.data.invoice.closingDate));
    protected readonly dueDateLabel = computed(() => formatUtcDateDayjs(this.data.invoice.dueDate));

    readonly transactions = signal<TransactionDto[]>([]);
    readonly loading = signal(false);
    readonly paying = signal(false);

    protected abs(val: number | string | null | undefined): number {
        if (val === null || val === undefined) return 0;
        const num = typeof val === "number" ? val : parseFloat(val);
        return isNaN(num) ? 0 : Math.abs(num);
    }

    ngOnInit(): void {
        this._loadTransactions();
    }

    protected async onPay(): Promise<void> {
        this.paying.set(true);

        try {
            await this.#facade.pay(this.data.creditCardId, this.data.invoice.id);
            this.#toast.success({ message: "Fatura paga com sucesso." });
            this.#dialogRef.close();
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível pagar a fatura.") : "Não foi possível pagar a fatura.";
            this.#toast.destructive({ message: "Erro ao pagar fatura", description: message });
        } finally {
            this.paying.set(false);
        }
    }

    private async _loadTransactions(): Promise<void> {
        this.loading.set(true);
        try {
            const transactions = await firstValueFrom(this.#transactionService.find({ invoiceId: this.data.invoice.id }));
            this.transactions.set(transactions);
        } finally {
            this.loading.set(false);
        }
    }
}
