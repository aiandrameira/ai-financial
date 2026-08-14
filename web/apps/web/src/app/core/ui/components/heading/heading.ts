import { AiIcon, AiIconType } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "ai-heading",
    imports: [AiIcon],
    template: `
        <div class="flex flex-col gap-y-0.5">
            <div class="flex items-center gap-x-2">
                @if (icon()) {
                    <ai-icon [icon]="icon()!" size="xl" class="text-primary" />
                }
                <h1 class="font-title text-2xl font-semibold text-primary">
                    {{ title() }}
                </h1>
            </div>
            <p class="text-sm font-semibold font-text text-muted-foreground">
                {{ description() }}
            </p>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiHeading {
    title = input.required<string>();
    description = input<string>("");
    icon = input<AiIconType | undefined>(undefined);
}
