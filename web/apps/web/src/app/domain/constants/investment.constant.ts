import type { AiIconType } from "@aiandralves/ai-ui";
import { tpInvestmentEnum, tpInvestmentMap, tpInvestmentMovementEnum, tpInvestmentMovementMap } from "@domain/enums";

export const INVESTMENT_TYPE_ICONS: Record<tpInvestmentEnum, AiIconType> = {
    [tpInvestmentEnum.FIXED_INCOME]: "shield-check",
    [tpInvestmentEnum.STOCK]: "line-chart",
    [tpInvestmentEnum.REIT]: "building-4",
    [tpInvestmentEnum.TREASURY]: "treasure-map",
    [tpInvestmentEnum.CRYPTO]: "bit-coin",
    [tpInvestmentEnum.FUND]: "pie-chart",
};

export const INVESTMENT_TYPES: { value: tpInvestmentEnum; label: string; icon: AiIconType }[] = Array.from(tpInvestmentMap, ([value, label]) => ({
    value,
    label,
    icon: INVESTMENT_TYPE_ICONS[value],
}));

export const INVESTMENT_MOVEMENT_TYPE_ICONS: Record<tpInvestmentMovementEnum, AiIconType> = {
    [tpInvestmentMovementEnum.BUY]: "arrow-down-circle",
    [tpInvestmentMovementEnum.SELL]: "arrow-up-circle",
    [tpInvestmentMovementEnum.DIVIDEND]: "hand-coin",
    [tpInvestmentMovementEnum.CONTRIBUTION]: "add-circle",
    [tpInvestmentMovementEnum.WITHDRAWAL]: "arrow-right",
};

export const INVESTMENT_MOVEMENT_TYPES: { value: tpInvestmentMovementEnum; label: string; icon: AiIconType }[] = Array.from(tpInvestmentMovementMap, ([value, label]) => ({
    value,
    label,
    icon: INVESTMENT_MOVEMENT_TYPE_ICONS[value],
}));
