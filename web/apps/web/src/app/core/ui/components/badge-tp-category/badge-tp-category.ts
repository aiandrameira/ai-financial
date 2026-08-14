import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { tpCategoryEnum, tpCategoryMap, tpCategoryTrendIconMap } from "@domain/enums";

import { MapLabelPipe, TpCategoryPipe } from "../../../pipes";
import { IconMaterial } from "../icon-material/icon-material";

@Component({
    selector: "ai-badge-tp-category",
    imports: [TpCategoryPipe, AiBadge, MapLabelPipe, IconMaterial],
    template: `
        @let item = type() | tpCategory;
        <ai-badge [variant]="item.variant" [icon]="trendIcon() ? undefined : item.icon" fill="line">
            @if (trendIcon(); as icon) {
                <ai-icon-material [icon]="icon" size="sm" />
            }
            {{ type() | mapLabel: tpCategoryMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpCategory {
    readonly type = input.required<tpCategoryEnum>();
    protected tpCategoryMap = tpCategoryMap;
    protected trendIcon = computed(() => tpCategoryTrendIconMap.get(this.type()) ?? null);
}
