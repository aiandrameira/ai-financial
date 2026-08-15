import { z } from "zod";

import { tpCreditCardNetworkEnum } from "../enums";

export const requestCreditCardSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    accountId: z.string().min(1, "Selecione uma conta").default(""),
    institution: z.string().default(""),
    limitAmount: z.number().positive("Informe um limite maior que zero").default(0),
    closingDay: z.number().int().min(1, "Dia inválido").max(31, "Dia inválido").default(1),
    dueDay: z.number().int().min(1, "Dia inválido").max(31, "Dia inválido").default(10),
    network: z.enum(tpCreditCardNetworkEnum).default(tpCreditCardNetworkEnum.OTHER),
    icon: z.string().default(""),
});

export type RequestCreditCardDto = z.infer<typeof requestCreditCardSchema>;

export function makeRequestCreditCard(raw: Partial<RequestCreditCardDto> = {}): RequestCreditCardDto {
    return requestCreditCardSchema.parse(raw);
}

export const creditCardSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    accountId: z.string(),
    institution: z.string().nullable(),
    limitAmount: z.string(),
    closingDay: z.number(),
    dueDay: z.number(),
    network: z.enum(tpCreditCardNetworkEnum),
    icon: z.string().nullable(),
    archivedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type CreditCardDto = z.infer<typeof creditCardSchema>;
