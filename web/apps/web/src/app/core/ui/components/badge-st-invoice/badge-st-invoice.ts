import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { stInvoiceEnum, stInvoiceMap } from "@domain/enums";

import { MapLabelPipe, StInvoicePipe } from "../../../pipes";

@Component({
    selector: "ai-badge-st-invoice",
    imports: [StInvoicePipe, AiBadge, MapLabelPipe],
    template: `
        @let item = status() | stInvoice;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ status() | mapLabel: stInvoiceMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeStInvoice {
    readonly status = input.required<stInvoiceEnum>();
    protected stInvoiceMap = stInvoiceMap;
}
