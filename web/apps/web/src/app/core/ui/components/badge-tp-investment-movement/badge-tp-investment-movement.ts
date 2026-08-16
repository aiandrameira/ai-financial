import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpInvestmentMovementEnum, tpInvestmentMovementMap } from "@domain/enums";

import { MapLabelPipe, TpInvestmentMovementPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-investment-movement",
    imports: [TpInvestmentMovementPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpInvestmentMovement;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpInvestmentMovementMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpInvestmentMovement {
    readonly type = input.required<tpInvestmentMovementEnum>();
    protected tpInvestmentMovementMap = tpInvestmentMovementMap;
}
