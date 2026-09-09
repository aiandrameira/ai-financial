import type { AiButtonToggleItem } from "@aiandralves/ai-ui";
import { tpRecurrenceFrequencyEnum, tpRecurrenceFrequencyMap, tpTransactionEnum, tpTransferMethodEnum } from "@domain/enums";

export const TRANSACTION_TYPES = Object.values(tpTransactionEnum).filter(type => type !== tpTransactionEnum.TRANSFER);

export const TRANSACTION_ORIGIN_ITEMS: AiButtonToggleItem[] = [
    { value: "account", label: "Conta", icon: "bank" },
    { value: "creditCard", label: "Cartão", icon: "bank-card" },
];

export const RECURRENCE_FREQUENCY_ITEMS: { value: tpRecurrenceFrequencyEnum; label: string }[] = Object.values(tpRecurrenceFrequencyEnum).map(value => ({
    value,
    label: tpRecurrenceFrequencyMap.get(value) ?? value,
}));

export const TRANSFER_METHODS = Object.values(tpTransferMethodEnum);

export const TRANSFER_METHOD_ICONS: Record<tpTransferMethodEnum, "exchange" | "qr-code"> = {
    [tpTransferMethodEnum.TRANSFER]: "exchange",
    [tpTransferMethodEnum.PIX]: "qr-code",
};
