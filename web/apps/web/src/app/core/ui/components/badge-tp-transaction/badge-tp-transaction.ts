import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { tpTransactionEnum, tpTransactionMap, tpTransactionTrendIconMap, tpTransferMethodEnum, tpTransferMethodMap } from "@domain/enums";

import { MapLabelPipe, TpTransactionPipe } from "../../../pipes";
import { IconMaterial } from "../icon-material/icon-material";

@Component({
    selector: "ai-badge-tp-transaction",
    imports: [TpTransactionPipe, AiBadge, MapLabelPipe, IconMaterial],
    template: `
        @if (isPix()) {
            <ai-badge variant="info" icon="qr-code" fill="line">{{ tpTransferMethodMap.get(method()!) }}</ai-badge>
        } @else {
            @let item = type() | tpTransaction;
            <ai-badge [variant]="item.variant" [icon]="trendIcon() ? undefined : item.icon" fill="line">
                @if (trendIcon(); as icon) {
                    <ai-icon-material [icon]="icon" size="sm" />
                }
                {{ type() | mapLabel: tpTransactionMap }}
            </ai-badge>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpTransaction {
    readonly type = input.required<tpTransactionEnum>();
    readonly method = input<tpTransferMethodEnum | null>(null);

    protected tpTransactionMap = tpTransactionMap;
    protected tpTransferMethodMap = tpTransferMethodMap;

    protected isPix = computed(() => this.type() === tpTransactionEnum.TRANSFER && this.method() === tpTransferMethodEnum.PIX);
    protected trendIcon = computed(() => tpTransactionTrendIconMap.get(this.type()) ?? null);
}
