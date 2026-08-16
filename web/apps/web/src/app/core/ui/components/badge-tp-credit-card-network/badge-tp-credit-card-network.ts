import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpCreditCardNetworkEnum, tpCreditCardNetworkMap } from "@domain/enums";

import { MapLabelPipe, TpCreditCardNetworkPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-credit-card-network",
    imports: [TpCreditCardNetworkPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpCreditCardNetwork;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpCreditCardNetworkMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpCreditCardNetwork {
    readonly type = input.required<tpCreditCardNetworkEnum>();
    protected tpCreditCardNetworkMap = tpCreditCardNetworkMap;
}
