import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpAssetEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpAsset",
})
export class TpAssetPipe implements PipeTransform {
    #map = new Map<tpAssetEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpAssetEnum.REAL_ESTATE, { variant: "primary", icon: "home" }],
        [tpAssetEnum.VEHICLE, { variant: "accent", icon: "car-washing" }],
        [tpAssetEnum.OTHER, { variant: "default", icon: "box-3" }],
    ]);

    transform(type: tpAssetEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(type) ?? { variant: "default", icon: "info-i" };
    }
}
