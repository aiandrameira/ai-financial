import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { stLoanInstallmentEnum, stLoanInstallmentMap } from "@domain/enums";

import { MapLabelPipe, StLoanInstallmentPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-st-loan-installment",
    imports: [StLoanInstallmentPipe, AiBadge, MapLabelPipe],
    template: `
        @let item = status() | stLoanInstallment;
        <ai-badge [variant]="item.variant" [icon]="item.icon" fill="line">
            {{ status() | mapLabel: stLoanInstallmentMap }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeStLoanInstallment {
    readonly status = input.required<stLoanInstallmentEnum>();
    protected stLoanInstallmentMap = stLoanInstallmentMap;
}
