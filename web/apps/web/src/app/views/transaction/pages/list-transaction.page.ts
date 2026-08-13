import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { AiBadge, AiButton, AiCard, AiCellTemplateDirective, AiEmpty, AiInput, AiLoader, AiSelectImports, AiTable, type AiTableColumn } from "@aiandralves/ai-ui";

import { matchesCategoryType } from "@core/utils";
import { stTransactionMap, tpTransactionEnum, tpTransactionMap } from "@domain/enums";
import type { TransactionDto } from "@domain/repositories";
import { makeCreateTransaction } from "@domain/schemas";
import { TransactionFacade } from "@infra/facades";

type SelectableTransactionType = Exclude<tpTransactionEnum, tpTransactionEnum.TRANSFER>;

const TRANSACTION_TYPES = Object.values(tpTransactionEnum).filter((type): type is SelectableTransactionType => type !== tpTransactionEnum.TRANSFER);

@Component({
    selector: "app-list-transaction-page",
    imports: [AiButton, AiCard, AiInput, AiSelectImports, AiTable, AiBadge, AiEmpty, AiLoader, AiCellTemplateDirective],
    templateUrl: "./list-transaction.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTransactionPage implements OnInit {
    protected facade = inject(TransactionFacade);

    protected transactionTypes = TRANSACTION_TYPES;
    protected typeMap = tpTransactionMap;

    protected form = signal(makeCreateTransaction());
    protected saving = signal(false);

    protected categoriesForType = computed(() => this.facade.categories().filter(category => matchesCategoryType(category.type, this.form().type)));

    protected canSubmit = computed(() => this.form().accountId.length > 0 && this.form().amount > 0 && this.form().date.length > 0 && !this.saving());

    protected columns: AiTableColumn<TransactionDto>[] = [
        { key: "date", label: "Data", cell: row => new Date(row.date).toLocaleDateString("pt-BR") },
        { key: "description", label: "Descrição" },
        { key: "amount", label: "Valor" },
        { key: "status", label: "Status", cell: row => stTransactionMap.get(row.status) ?? row.status },
    ];

    ngOnInit(): void {
        void this.facade.load();
    }

    protected accountName(accountId: string): string {
        return this.facade.accounts().find(account => account.id === accountId)?.name ?? accountId;
    }

    protected setAccount(value: string | string[]): void {
        const accountId = Array.isArray(value) ? (value[0] ?? "") : value;
        this.form.update(current => ({ ...current, accountId }));
    }

    protected setCategory(value: string | string[]): void {
        const categoryId = Array.isArray(value) ? (value[0] ?? "") : value;
        this.form.update(current => ({ ...current, categoryId }));
    }

    protected setType(value: SelectableTransactionType | SelectableTransactionType[]): void {
        const type = Array.isArray(value) ? value[0] : value;
        this.form.update(current => ({ ...current, type, categoryId: "" }));
    }

    protected setAmount(value: string | number | null): void {
        this.form.update(current => ({ ...current, amount: Number(value ?? 0) }));
    }

    protected setDescription(value: string | number | null): void {
        this.form.update(current => ({ ...current, description: String(value ?? "") }));
    }

    protected setDate(value: string | number | null): void {
        this.form.update(current => ({ ...current, date: String(value ?? "") }));
    }

    protected async onSubmit(): Promise<void> {
        if (!this.canSubmit()) return;

        this.saving.set(true);
        try {
            await this.facade.create(this.form());
            this.form.set(makeCreateTransaction());
        } finally {
            this.saving.set(false);
        }
    }
}
