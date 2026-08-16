import type { AiIconType } from "@aiandralves/ai-ui";
import { tpCategoryEnum } from "@domain/enums";
import type { BadgeVariant } from "@domain/types";

export const CATEGORY_TYPES = Object.values(tpCategoryEnum);

export const CATEGORY_ICONS: AiIconType[] = [
    "restaurant",
    "shopping-cart-2",
    "car",
    "home",
    "heart-pulse",
    "graduation-cap",
    "gift",
    "briefcase",
    "plane",
    "wallet",
    "movie-2",
    "music",
    "store",
    "bank",
    "receipt",
    "umbrella",
    "beer",
    "shapes",
];

export const CATEGORY_COLORS: { value: BadgeVariant; label: string }[] = [
    { value: "default", label: "Cinza" },
    { value: "primary", label: "Azul" },
    { value: "accent", label: "Roxo" },
    { value: "outline", label: "Contorno" },
    { value: "destructive", label: "Vermelho" },
    { value: "info", label: "Ciano" },
    { value: "success", label: "Verde" },
    { value: "warning", label: "Amarelo" },
];
