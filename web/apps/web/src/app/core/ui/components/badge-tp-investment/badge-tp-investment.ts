import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpInvestmentEnum, tpInvestmentMap } from "@domain/enums";

import { MapLabelPipe, TpInvestmentPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-investment",
    imports: [TpInvestmentPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpInvestment;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpInvestmentMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpInvestment {
    readonly type = input.required<tpInvestmentEnum>();
    protected tpInvestmentMap = tpInvestmentMap;
}
