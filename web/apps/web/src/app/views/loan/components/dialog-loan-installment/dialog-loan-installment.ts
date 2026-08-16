import { AI_DIALOG_DATA, AiButton, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { finalize } from "rxjs";

import { formatUtcDateDayjs } from "@core/helpers";
import { BadgeStLoanInstallment } from "@core/ui";
import { LOAN_INSTALLMENT_STATUS_VARIANT } from "@domain/constants";
import { stLoanInstallmentEnum, stLoanInstallmentMap } from "@domain/enums";
import { LoanDto, LoanInstallmentDto } from "@domain/schemas";
import { LoanInstallmentService } from "@infra/services";

@Component({
    selector: "ai-dialog-loan-installment",
    imports: [AiButton, CurrencyPipe, DatePipe, BadgeStLoanInstallment],
    templateUrl: "./dialog-loan-installment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLoanInstallment {
    #service = inject(LoanInstallmentService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogLoanInstallment>);

    protected readonly data = inject<{ loan: LoanDto; installment: LoanInstallmentDto }>(AI_DIALOG_DATA as never);

    protected readonly statusVariant = LOAN_INSTALLMENT_STATUS_VARIANT;
    protected readonly stLoanInstallmentMap = stLoanInstallmentMap;
    protected readonly stLoanInstallmentEnum = stLoanInstallmentEnum;
    protected readonly dueDateLabel = formatUtcDateDayjs(this.data.installment.dueDate);

    readonly paying = signal(false);

    protected onPay(): void {
        this.paying.set(true);

        this.#service
            .pay(this.data.loan.id, this.data.installment.id)
            .pipe(finalize(() => this.paying.set(false)))
            .subscribe({
                next: () => {
                    this.#toast.success({ message: "Parcela paga com sucesso." });
                    this.#dialogRef.close();
                },
                error: error => {
                    const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível pagar a parcela.") : "Não foi possível pagar a parcela.";
                    this.#toast.destructive({ message: "Erro ao pagar parcela", description: message });
                },
            });
    }
}
