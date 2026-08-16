import type { AiIconType } from "@aiandralves/ai-ui";
import { tpAssetEnum, tpAssetMap } from "@domain/enums";

export const ASSET_TYPE_ICONS: Record<tpAssetEnum, AiIconType> = {
    [tpAssetEnum.REAL_ESTATE]: "home",
    [tpAssetEnum.VEHICLE]: "car-washing",
    [tpAssetEnum.OTHER]: "box-3",
};

export const ASSET_TYPES: { value: tpAssetEnum; label: string; icon: AiIconType }[] = Array.from(tpAssetMap, ([value, label]) => ({
    value,
    label,
    icon: ASSET_TYPE_ICONS[value],
}));
