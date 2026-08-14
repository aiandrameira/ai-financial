import { ChangeDetectionStrategy, Component, computed, input, model, signal } from "@angular/core";
import { AiBadge, AiCheckbox, AiIcon, AiPopoverImports, AiSeparator } from "@aiandralves/ai-ui";

import type { FilterSelectOption } from "./filter-select.model";

@Component({
    selector: "ai-filter-select",
    imports: [AiPopoverImports, AiIcon, AiSeparator, AiCheckbox, AiBadge],
    templateUrl: "./filter-select.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSelect {
    label = input.required<string>();
    options = input<FilterSelectOption[]>([]);
    searchPlaceholder = input("Buscar...");
    summaryThreshold = input(2);

    value = model<string[]>([]);

    protected search = signal("");

    protected filteredOptions = computed(() => {
        const term = this.search().trim().toLowerCase();
        if (!term) return this.options();
        return this.options().filter(option => option.label.toLowerCase().includes(term));
    });

    protected summary = computed(() => {
        const selected = this.value();
        if (selected.length === 0) return null;
        if (selected.length > this.summaryThreshold()) return `${selected.length} selecionados`;

        return this.options()
            .filter(option => selected.includes(option.value))
            .map(option => option.label)
            .join(", ");
    });

    protected isSelected(optionValue: string): boolean {
        return this.value().includes(optionValue);
    }

    protected toggle(optionValue: string): void {
        const current = this.value();
        this.value.set(current.includes(optionValue) ? current.filter(value => value !== optionValue) : [...current, optionValue]);
    }

    protected clear(): void {
        this.value.set([]);
        this.search.set("");
    }

    protected setSearch(value: string): void {
        this.search.set(value);
    }
}
