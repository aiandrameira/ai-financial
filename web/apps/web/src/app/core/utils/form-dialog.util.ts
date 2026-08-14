import { AiIconType } from "@aiandralves/ai-ui";

export function formDialogOptions(title: string, description: string, icon: AiIconType) {
    return {
        title,
        description,
        icon,
        hideFooter: true as const,
        width: "480px",
    };
}
