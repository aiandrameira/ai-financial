import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpInvestmentEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpInvestment",
})
export class TpInvestmentPipe implements PipeTransform {
    #map = new Map<tpInvestmentEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpInvestmentEnum.FIXED_INCOME, { variant: "success", icon: "shield-check" }],
        [tpInvestmentEnum.STOCK, { variant: "primary", icon: "line-chart" }],
        [tpInvestmentEnum.REIT, { variant: "accent", icon: "building-4" }],
        [tpInvestmentEnum.TREASURY, { variant: "info", icon: "treasure-map" }],
        [tpInvestmentEnum.CRYPTO, { variant: "warning", icon: "bit-coin" }],
        [tpInvestmentEnum.FUND, { variant: "outline", icon: "pie-chart" }],
    ]);

    transform(type: tpInvestmentEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
