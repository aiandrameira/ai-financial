import { AiBadge, AiTableColumn, AiTableConfig } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from "@angular/core";
import { formatMonthYearDayjs } from "@core/helpers";
import { DueSoonPipe, TrendPipe } from "@core/pipes";
import { BadgeStInvoice, createCursorPageNav, IconMaterial, TableImports, toAiTablePagination } from "@core/ui";
import { stInvoiceMap } from "@domain/enums";
import { CreditCardInvoiceDto } from "@domain/schemas";
import { CreditCardInvoiceFacade } from "@infra/facades";

@Component({
    selector: "ai-table-credit-card-invoice",
    imports: [TableImports, AiBadge, IconMaterial, BadgeStInvoice, TrendPipe, DueSoonPipe],
    templateUrl: "./table-credit-card-invoice.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCreditCardInvoice {
    #facade = inject(CreditCardInvoiceFacade);

    readonly creditCardId = input.required<string>();
    readonly view = output<CreditCardInvoiceDto>();

    protected readonly stInvoiceMap = stInvoiceMap;
    protected abs = (value: string): number => Math.abs(Number(value));

    readonly paginationConfig = toAiTablePagination(this.#facade, [5, 10, 20, 50]);
    readonly #pageNav = createCursorPageNav(this.#facade);
    readonly onPageChange = this.#pageNav.onPageChange;
    readonly onPageSizeChange = this.#pageNav.onPageSizeChange;

    readonly columns = signal<AiTableColumn<CreditCardInvoiceDto>[]>([
        { key: "referenceMonth", label: "Mês" },
        { key: "status", label: "Status" },
        { key: "totalAmount", label: "Total" },
        { key: "dueDate", label: "Vencimento" },
    ]);

    readonly config = computed<AiTableConfig<CreditCardInvoiceDto>>(() => ({
        columns: this.columns(),
        data: this.#facade.invoices(),
    }));

    constructor() {
        effect(() => {
            const creditCardId = this.creditCardId();
            if (creditCardId) {
                untracked(() => this.#facade.load(creditCardId));
            }
        });
    }

    rowClick(item: CreditCardInvoiceDto) {
        this.view.emit(item);
    }

    protected monthLabel(referenceMonth: string): string {
        return formatMonthYearDayjs(referenceMonth);
    }
}
