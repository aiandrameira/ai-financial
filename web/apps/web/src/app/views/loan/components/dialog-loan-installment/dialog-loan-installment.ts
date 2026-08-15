import { AI_DIALOG_DATA, AiBadge, AiButton, AiDialogRef, AiToastService } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";

import { formatUtcDateDayjs } from "@core/helpers";
import { stLoanInstallmentEnum, stLoanInstallmentMap } from "@domain/enums";
import { LoanDto, LoanInstallmentDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { LoanInstallmentFacade } from "@infra/facades";

const STATUS_VARIANT: Record<stLoanInstallmentEnum, BadgeVariant> = {
    [stLoanInstallmentEnum.PENDING]: "info",
    [stLoanInstallmentEnum.PAID]: "success",
    [stLoanInstallmentEnum.LATE]: "destructive",
};

@Component({
    selector: "ai-dialog-loan-installment",
    imports: [AiBadge, AiButton, CurrencyPipe, DatePipe],
    templateUrl: "./dialog-loan-installment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLoanInstallment {
    #facade = inject(LoanInstallmentFacade);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogLoanInstallment>);

    protected readonly data = inject<{ loan: LoanDto; installment: LoanInstallmentDto }>(AI_DIALOG_DATA as never);

    protected readonly statusVariant = STATUS_VARIANT;
    protected readonly stLoanInstallmentMap = stLoanInstallmentMap;
    protected readonly stLoanInstallmentEnum = stLoanInstallmentEnum;
    protected readonly dueDateLabel = formatUtcDateDayjs(this.data.installment.dueDate);

    readonly paying = signal(false);

    protected async onPay(): Promise<void> {
        this.paying.set(true);

        try {
            await this.#facade.pay(this.data.loan.id, this.data.installment.id);
            this.#toast.success({ message: "Parcela paga com sucesso." });
            this.#dialogRef.close();
        } catch (error) {
            const message = error instanceof HttpErrorResponse ? (error.error?.meta?.message ?? "Não foi possível pagar a parcela.") : "Não foi possível pagar a parcela.";
            this.#toast.destructive({ message: "Erro ao pagar parcela", description: message });
        } finally {
            this.paying.set(false);
        }
    }
}
