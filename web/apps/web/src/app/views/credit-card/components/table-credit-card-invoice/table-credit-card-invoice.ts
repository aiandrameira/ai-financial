import { AiBadge, AiTableColumn, AiTableConfig } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { formatMonthYearDayjs, formatUtcDateDayjs } from "@core/helpers";
import { TrendPipe } from "@core/pipes";
import { BadgeStInvoice, IconMaterial, TableImports } from "@core/ui";
import { stInvoiceMap } from "@domain/enums";
import { CreditCardInvoiceDto } from "@domain/schemas";
import { CreditCardInvoiceService } from "@infra/services";

@Component({
    selector: "ai-table-credit-card-invoice",
    imports: [TableImports, AiBadge, IconMaterial, BadgeStInvoice, TrendPipe],
    templateUrl: "./table-credit-card-invoice.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCreditCardInvoice {
    #service = inject(CreditCardInvoiceService);

    #invoices = signal<CreditCardInvoiceDto[]>([]);

    readonly creditCardId = input.required<string>();
    readonly view = output<CreditCardInvoiceDto>();

    protected readonly stInvoiceMap = stInvoiceMap;
    protected abs = (value: string): number => Math.abs(Number(value));

    readonly columns = signal<AiTableColumn<CreditCardInvoiceDto>[]>([
        { key: "referenceMonth", label: "Mês" },
        { key: "status", label: "Status" },
        { key: "totalAmount", label: "Total" },
        { key: "dueDate", label: "Vencimento" },
    ]);

    readonly config = computed<AiTableConfig<CreditCardInvoiceDto>>(() => ({
        columns: this.columns(),
        data: this.#invoices(),
    }));

    constructor() {
        effect(() => {
            const creditCardId = this.creditCardId();
            if (creditCardId) {
                this.#service.find(creditCardId).subscribe(invoices => this.#invoices.set(invoices));
            }
        });
    }

    rowClick(item: CreditCardInvoiceDto) {
        this.view.emit(item);
    }

    protected monthLabel(referenceMonth: string): string {
        return formatMonthYearDayjs(referenceMonth);
    }

    protected dueDateLabel(dueDate: string): string {
        return formatUtcDateDayjs(dueDate);
    }
}
