import { AiBadge, AiIconType } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { CategoryDto } from "@domain/schemas";
import { BadgeVariant } from "@domain/types";

@Component({
    selector: "ai-badge-category",
    imports: [AiBadge],
    template: ` <ai-badge [icon]="icon()" [variant]="variant()" fill="line">{{ category().name }}</ai-badge> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeCategory {
    readonly category = input.required<CategoryDto>();

    protected readonly icon = computed<AiIconType>(() => (this.category().icon as AiIconType) ?? "shapes");
    protected readonly variant = computed<BadgeVariant>(() => (this.category().color as BadgeVariant) ?? "default");
}
