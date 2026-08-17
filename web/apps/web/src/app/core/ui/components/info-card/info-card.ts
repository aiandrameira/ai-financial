import type { AiIconType } from "@aiandralves/ai-ui";
import { AiIcon } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "ai-info-card",
    imports: [AiIcon],
    template: `
        <div class="flex items-center gap-x-3 bg-muted/40 dark:bg-zinc-900/40 p-3.5 rounded-xl border border-border/60">
            <div class="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ai-icon [icon]="icon()" size="sm" />
            </div>
            <div class="flex flex-col min-w-0">
                <span class="text-[11px] font-medium text-muted-foreground">{{ label() }}</span>
                <span class="text-sm font-semibold text-primary truncate">{{ value() }}</span>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
    readonly label = input.required<string>();
    readonly value = input.required<string>();
    readonly icon = input<AiIconType>("calendar");
}
