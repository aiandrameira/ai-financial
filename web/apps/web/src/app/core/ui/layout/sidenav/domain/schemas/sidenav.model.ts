import type { AiIconType } from "@aiandralves/ai-ui";

export type SidenavItem = {
    icon: AiIconType;
    label: string;
    path: string;
};

export type SidenavGroup = {
    label: string;
    items: SidenavItem[];
};

export type SidenavUser = {
    name: string;
    email?: string;
    avatarUrl?: string;
};

export type SidenavUserMenuItem = {
    icon: AiIconType;
    label: string;
    action: string;
};
