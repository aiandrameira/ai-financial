import { AiBadge, AiTableColumn, AiTableConfig } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { DueSoonPipe } from "@core/pipes";
import { BadgeStLoanInstallment, createCursorPageNav, TableImports, toAiTablePagination } from "@core/ui";
import { stLoanInstallmentMap } from "@domain/enums";
import { LoanInstallmentDto } from "@domain/schemas";
import { LoanInstallmentFacade } from "@infra/facades";

@Component({
    selector: "ai-table-loan-installment",
    imports: [TableImports, AiBadge, BadgeStLoanInstallment, DueSoonPipe],
    templateUrl: "./table-loan-installment.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoanInstallment {
    #facade = inject(LoanInstallmentFacade);

    readonly loanId = input.required<string>();
    readonly view = output<LoanInstallmentDto>();

    protected readonly stLoanInstallmentMap = stLoanInstallmentMap;

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorPageNav(this.#facade);
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

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
            if (loanId) {
                untracked(() => this.#facade.load(loanId));
            }
        });
    }

    rowClick(item: LoanInstallmentDto) {
        this.view.emit(item);
    }
}
