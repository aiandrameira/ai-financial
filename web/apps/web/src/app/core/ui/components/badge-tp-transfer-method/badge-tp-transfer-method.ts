import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { tpTransferMethodEnum, tpTransferMethodMap } from "@domain/enums";

import { MapLabelPipe, TpTransferMethodPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-transfer-method",
    imports: [TpTransferMethodPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = type() | tpTransferMethod;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ type() | mapLabel: tpTransferMethodMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpTransferMethod {
    readonly type = input.required<tpTransferMethodEnum>();
    protected tpTransferMethodMap = tpTransferMethodMap;
}
