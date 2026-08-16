import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpAssetEnum, tpAssetMap } from "@domain/enums";

import { MapLabelPipe, TpAssetPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-asset",
    imports: [TpAssetPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpAsset;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpAssetMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpAsset {
    readonly type = input.required<tpAssetEnum>();
    protected tpAssetMap = tpAssetMap;
}
