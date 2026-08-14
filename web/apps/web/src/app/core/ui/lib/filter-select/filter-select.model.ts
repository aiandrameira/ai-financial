import type { AiIconType } from "@aiandralves/ai-ui";

export type FilterSelectBadgeVariant = "default" | "primary" | "accent" | "outline" | "destructive" | "info" | "success" | "warning";

export type FilterSelectOption = {
    value: string;
    label: string;
    badgeVariant?: FilterSelectBadgeVariant;
    icon?: AiIconType;
};
