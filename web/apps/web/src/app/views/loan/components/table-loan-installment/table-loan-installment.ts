import { AiBadge, AiTableColumn, AiTableConfig } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { TableImports } from "@core/ui";
import { stLoanInstallmentEnum, stLoanInstallmentMap } from "@domain/enums";
import { LoanInstallmentDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";
import { LoanInstallmentFacade } from "@infra/facades";

const STATUS_VARIANT: Record<stLoanInstallmentEnum, BadgeVariant> = {
    [stLoanInstallmentEnum.PENDING]: "info",
    [stLoanInstallmentEnum.PAID]: "success",
    [stLoanInstallmentEnum.LATE]: "destructive",
};

@Component({
    selector: "ai-table-loan-installment",
    imports: [TableImports, AiBadge],
    templateUrl: "./table-loan-installment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoanInstallment {
    #facade = inject(LoanInstallmentFacade);

    readonly loanId = input.required<string>();
    readonly view = output<LoanInstallmentDto>();

    protected readonly stLoanInstallmentMap = stLoanInstallmentMap;

    readonly columns = signal<AiTableColumn<LoanInstallmentDto>[]>([
        { key: "number", label: "Parcela" },
        { key: "dueDate", label: "Vencimento" },
        { key: "amount", label: "Valor" },
        { key: "status", label: "Status" },
    ]);

    readonly config = computed<AiTableConfig<LoanInstallmentDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.installments(),
    }));

    constructor() {
        effect(() => {
            const loanId = this.loanId();
            this.#facade.load(loanId);
        });
    }

    rowClick(item: LoanInstallmentDto) {
        this.view.emit(item);
    }

    protected dueDateLabel(dueDate: string): string {
        return formatUtcDateDayjs(dueDate);
    }

    protected statusVariant(status: stLoanInstallmentEnum): BadgeVariant {
        return STATUS_VARIANT[status];
    }
}
