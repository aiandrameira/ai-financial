import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { stTransactionEnum, stTransactionMap } from "@domain/enums";

import { MapLabelPipe, StTransactionPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-st-transaction",
    imports: [StTransactionPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = status() | stTransaction;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ status() | mapLabel: stTransactionMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeStTransaction {
    readonly status = input.required<stTransactionEnum>();
    protected stTransactionMap = stTransactionMap;
}
