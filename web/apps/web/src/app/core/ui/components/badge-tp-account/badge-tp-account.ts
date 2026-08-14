import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpAccountEnum, tpAccountMap } from "@domain/enums";

import { MapLabelPipe, TpAccountPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-account",
    imports: [TpAccountPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpAccount;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpAccountMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpAccount {
    readonly type = input.required<tpAccountEnum>();
    protected tpAccountMap = tpAccountMap;
}
