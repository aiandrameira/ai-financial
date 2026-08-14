import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpTransactionEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpTransaction",
})
export class TpTransactionPipe implements PipeTransform {
    #map = new Map<tpTransactionEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpTransactionEnum.EXPENSE, { variant: "destructive", icon: "arrow-left-down-long" }],
        [tpTransactionEnum.INCOME, { variant: "success", icon: "arrow-left-up-long" }],
        [tpTransactionEnum.TRANSFER, { variant: "default", icon: "exchange" }],
    ]);

    transform(type: tpTransactionEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
