import { AiIconType } from "@aiandralves/ai-ui";

export function archiveAlertDialog(value: string | number, title: string) {
    return {
        icon: {
            name: "archive" as AiIconType,
            color: "destructive" as "destructive" | "primary" | "warning" | undefined,
        },
        title: `Arquivar ${title.toLowerCase()}`,
        description: `Tem certeza que deseja arquivar o registro ${(value as string).toLowerCase()}? Contas arquivadas saem da listagem, mas o histórico de transações é preservado.`,
        confirmText: "Sim, arquivar",
        cancelText: "Cancelar",
    };
}
