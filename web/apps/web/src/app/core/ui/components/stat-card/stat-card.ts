import type { AiIconType } from "@aiandralves/ai-ui";
import { AiIcon } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

export type StatCardVariant = "emerald" | "amber" | "sky" | "indigo" | "violet" | "rose" | "primary" | "default";

const VARIANT_STYLES: Record<StatCardVariant, string> = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    primary: "bg-primary/10 text-primary",
    default: "bg-muted text-muted-foreground",
};

@Component({
    selector: "ai-stat-card",
    imports: [AiIcon],
    template: `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-full">
            <div class="flex items-center justify-between gap-x-2">
                <span class="text-xs font-semibold text-muted-foreground truncate">{{ title() }}</span>
                <div [class]="iconWrapperClasses()">
                    <ai-icon [icon]="icon()" size="sm" />
                </div>
            </div>
            <div class="mt-2.5 flex items-baseline gap-x-1.5 flex-wrap">
                <span class="font-title text-base sm:text-lg font-bold text-primary tracking-tight whitespace-nowrap block">
                    {{ value() }}
                </span>
                <ng-content />
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
    readonly title = input.required<string>();
    readonly value = input<string | number | null>("");
    readonly icon = input<AiIconType>("information-2");
    readonly variant = input<StatCardVariant>("primary");

    protected readonly iconWrapperClasses = computed(() => {
        const style = VARIANT_STYLES[this.variant()] ?? VARIANT_STYLES.primary;
        return `h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${style}`;
    });
}
