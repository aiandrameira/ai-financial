import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpTransactionEnum, tpTransactionMap } from "@domain/enums";

import { MapLabelPipe, TpTransactionPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-transaction",
    imports: [TpTransactionPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpTransaction;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpTransactionMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpTransaction {
    readonly type = input.required<tpTransactionEnum>();
    protected tpTransactionMap = tpTransactionMap;
}
