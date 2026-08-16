import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpInvestmentMovementEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpInvestmentMovement",
})
export class TpInvestmentMovementPipe implements PipeTransform {
    #map = new Map<tpInvestmentMovementEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpInvestmentMovementEnum.BUY, { variant: "primary", icon: "arrow-down-circle" }],
        [tpInvestmentMovementEnum.SELL, { variant: "warning", icon: "arrow-up-circle" }],
        [tpInvestmentMovementEnum.DIVIDEND, { variant: "success", icon: "hand-coin" }],
        [tpInvestmentMovementEnum.CONTRIBUTION, { variant: "info", icon: "add-circle" }],
        [tpInvestmentMovementEnum.WITHDRAWAL, { variant: "destructive", icon: "arrow-right" }],
    ]);

    transform(type: tpInvestmentMovementEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
