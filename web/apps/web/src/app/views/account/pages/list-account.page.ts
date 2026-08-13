import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { AiButton, AiCard, AiEmpty, AiInput, AiLoader, AiSelectImports, AiTable, type AiTableColumn } from "@aiandralves/ai-ui";

import { tpAccountEnum, tpAccountMap } from "@domain/enums";
import type { AccountDto } from "@domain/repositories";
import { makeCreateAccount } from "@domain/schemas";
import { AccountFacade } from "@infra/facades";

const ACCOUNT_TYPES = Object.values(tpAccountEnum);

@Component({
    selector: "app-list-account-page",
    imports: [AiButton, AiCard, AiInput, AiSelectImports, AiTable, AiEmpty, AiLoader],
    templateUrl: "./list-account.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAccountPage implements OnInit {
    protected facade = inject(AccountFacade);

    protected accountTypes = ACCOUNT_TYPES;
    protected typeMap = tpAccountMap;

    protected form = signal(makeCreateAccount());
    protected saving = signal(false);

    protected canSubmit = computed(() => this.form().name.trim().length > 0 && !this.saving());

    protected columns: AiTableColumn<AccountDto>[] = [
        { key: "name", label: "Nome" },
        { key: "type", label: "Tipo", cell: row => tpAccountMap.get(row.type) ?? row.type },
        { key: "currentBalance", label: "Saldo atual" },
        { key: "projectedBalance", label: "Saldo projetado" },
    ];

    ngOnInit(): void {
        void this.facade.load();
    }

    protected setName(value: string | number | null): void {
        this.form.update(current => ({ ...current, name: String(value ?? "") }));
    }

    protected setInstitution(value: string | number | null): void {
        this.form.update(current => ({ ...current, institution: String(value ?? "") }));
    }

    protected setInitialBalance(value: string | number | null): void {
        this.form.update(current => ({ ...current, initialBalance: Number(value ?? 0) }));
    }

    protected setType(value: tpAccountEnum | tpAccountEnum[]): void {
        const type = Array.isArray(value) ? value[0] : value;
        this.form.update(current => ({ ...current, type }));
    }

    protected async onSubmit(): Promise<void> {
        if (!this.canSubmit()) return;

        this.saving.set(true);
        try {
            await this.facade.create(this.form());
            this.form.set(makeCreateAccount());
        } finally {
            this.saving.set(false);
        }
    }
}
