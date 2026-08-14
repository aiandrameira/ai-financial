import { AiIconType } from "@aiandralves/ai-ui";

export function removeAlertDialog(value: string | number, title: string) {
    return {
        icon: {
            name: "delete-bin" as AiIconType,
            color: "destructive" as "destructive" | "primary" | "warning" | undefined,
        },
        title: `Apagar ${title.toLowerCase()}`,
        description: `Tem certeza que deseja apagar o registro ${(value as string).toLowerCase()}?`,
        confirmText: "Sim, apagar",
        cancelText: "Cancelar",
    };
}
