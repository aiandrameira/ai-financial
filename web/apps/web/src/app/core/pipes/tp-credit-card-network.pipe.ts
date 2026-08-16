import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpCreditCardNetworkEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpCreditCardNetwork",
})
export class TpCreditCardNetworkPipe implements PipeTransform {
    #map = new Map<tpCreditCardNetworkEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpCreditCardNetworkEnum.MASTERCARD, { variant: "destructive", icon: "bank-card" }],
        [tpCreditCardNetworkEnum.VISA, { variant: "primary", icon: "bank-card" }],
        [tpCreditCardNetworkEnum.ELO, { variant: "warning", icon: "bank-card" }],
        [tpCreditCardNetworkEnum.AMEX, { variant: "info", icon: "bank-card" }],
        [tpCreditCardNetworkEnum.OTHER, { variant: "default", icon: "bank-card" }],
    ]);

    transform(type: tpCreditCardNetworkEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "bank-card" };
    }
}
