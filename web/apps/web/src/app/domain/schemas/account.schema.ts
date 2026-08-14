import { z } from "zod";

import { tpAccountEnum } from "../enums";

export const requestAccountSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    type: z.enum(tpAccountEnum).default(tpAccountEnum.CHECKING),
    institution: z.string().default(""),
    initialBalance: z.number().default(0),
});

export type RequestAccountDto = z.infer<typeof requestAccountSchema>;

export function makeRequestAccount(raw: Partial<RequestAccountDto> = {}): RequestAccountDto {
    return requestAccountSchema.parse(raw);
}

export const accountSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string(),
    type: z.enum(tpAccountEnum),
    institution: z.string().nullable(),
    initialBalance: z.string(),
    currentBalance: z.string(),
    projectedBalance: z.string(),
    color: z.string().nullable(),
    icon: z.string().nullable(),
    archivedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type AccountDto = z.infer<typeof accountSchema>;
