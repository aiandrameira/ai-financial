import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpAccountEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpAccount",
})
export class TpAccountPipe implements PipeTransform {
    #map = new Map<tpAccountEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpAccountEnum.CHECKING, { variant: "warning", icon: "bank" }],
        [tpAccountEnum.SAVINGS, { variant: "info", icon: "coins" }],
        [tpAccountEnum.WALLET, { variant: "success", icon: "wallet" }],
    ]);

    transform(type: tpAccountEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
