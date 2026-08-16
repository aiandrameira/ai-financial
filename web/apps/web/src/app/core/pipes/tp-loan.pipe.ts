import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpLoanEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpLoan",
})
export class TpLoanPipe implements PipeTransform {
    #map = new Map<tpLoanEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpLoanEnum.REAL_ESTATE, { variant: "primary", icon: "home" }],
        [tpLoanEnum.VEHICLE, { variant: "accent", icon: "car" }],
        [tpLoanEnum.PERSONAL, { variant: "info", icon: "user" }],
        [tpLoanEnum.CONSORTIUM, { variant: "warning", icon: "group-2" }],
    ]);

    transform(type: tpLoanEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
