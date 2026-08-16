import { AiBadge, AiTableColumn, AiTableConfig } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { formatUtcDateDayjs } from "@core/helpers";
import { BadgeStLoanInstallment, TableImports } from "@core/ui";
import { stLoanInstallmentMap } from "@domain/enums";
import { LoanInstallmentDto } from "@domain/schemas";
import { LoanInstallmentService } from "@infra/services";

@Component({
    selector: "ai-table-loan-installment",
    imports: [TableImports, AiBadge, BadgeStLoanInstallment],
    templateUrl: "./table-loan-installment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoanInstallment {
    #service = inject(LoanInstallmentService);

    #installments = signal<LoanInstallmentDto[]>([]);

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
        data: this.#installments(),
    }));

    constructor() {
        effect(() => {
            const loanId = this.loanId();
            if (loanId) {
                this.#service.find(loanId).subscribe(installments => this.#installments.set(installments));
            }
        });
    }

    rowClick(item: LoanInstallmentDto) {
        this.view.emit(item);
    }

    protected dueDateLabel(dueDate: string): string {
        return formatUtcDateDayjs(dueDate);
    }
}
