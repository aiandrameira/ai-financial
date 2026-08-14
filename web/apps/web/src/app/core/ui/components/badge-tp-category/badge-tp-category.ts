import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpCategoryEnum, tpCategoryMap } from "@domain/enums";

import { MapLabelPipe, TpCategoryPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-category",
    imports: [TpCategoryPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpCategory;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpCategoryMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpCategory {
    readonly type = input.required<tpCategoryEnum>();
    protected tpCategoryMap = tpCategoryMap;
}
