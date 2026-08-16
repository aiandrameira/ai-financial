import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { CategoryDto } from "@domain/schemas";

@Component({
    selector: "ai-badge-category",
    imports: [AiBadge],
    template: ` <ai-badge variant="default" fill="line">{{ category().name }}</ai-badge> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeCategory {
    readonly category = input.required<CategoryDto>();
}
