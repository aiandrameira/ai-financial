import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpLoanEnum, tpLoanMap } from "@domain/enums";

import { MapLabelPipe, TpLoanPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-loan",
    imports: [TpLoanPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpLoan;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpLoanMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpLoan {
    readonly type = input.required<tpLoanEnum>();
    protected tpLoanMap = tpLoanMap;
}
