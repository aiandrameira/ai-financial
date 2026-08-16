import { AiBadge } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { tpAccountEnum, tpAccountMap } from "@domain/enums";
import { AccountDto } from "@domain/schemas";

import { TpAccountPipe } from "../../../pipes";

@Component({
    selector: "ai-badge-tp-account",
    imports: [TpAccountPipe, AiBadge],
    template: `
        @let badge = resolvedType() | tpAccount;
        <ai-badge [variant]="badge.variant" [icon]="badge.icon" fill="line">
            {{ resolvedLabel() }}
        </ai-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeTpAccount {
    readonly type = input<tpAccountEnum | null>(null);
    readonly account = input<AccountDto | null>(null);
    readonly value = input<tpAccountEnum | AccountDto | null>(null);

    protected readonly resolvedType = computed<tpAccountEnum>(() => {
        const type = this.type();
        const account = this.account();
        if (type) return type;
        if (account) return account.type;

        const val = this.value();
        if (val && typeof val === "object" && "type" in val) return val.type;
        if (val && typeof val === "string") return val as tpAccountEnum;
        return tpAccountEnum.CHECKING;
    });

    protected readonly resolvedLabel = computed<string>(() => {
        const account = this.account();
        if (account) return account.name;

        const val = this.value();
        if (val && typeof val === "object" && "name" in val) return val.name;
        const t = this.resolvedType();
        return tpAccountMap.get(t) ?? String(t);
    });
}
