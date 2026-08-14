import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpCategoryEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpCategory",
})
export class TpCategoryPipe implements PipeTransform {
    #map = new Map<tpCategoryEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpCategoryEnum.EXPENSE, { variant: "destructive", icon: "arrow-left-down-long" }],
        [tpCategoryEnum.INCOME, { variant: "success", icon: "arrow-left-up-long" }],
    ]);

    transform(type: tpCategoryEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
