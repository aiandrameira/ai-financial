import { z } from "zod";

import { tpAccountEnum } from "../enums";

export const createAccountSchema = z.object({
    name: z.string().min(1, "Informe um nome"),
    type: z.enum(tpAccountEnum),
    institution: z.string().optional(),
    initialBalance: z.number(),
});

export type CreateAccount = z.infer<typeof createAccountSchema>;

export function makeCreateAccount(overrides: Partial<CreateAccount> = {}): CreateAccount {
    return {
        name: "",
        type: tpAccountEnum.CHECKING,
        institution: "",
        initialBalance: 0,
        ...overrides,
    };
}

export type AccountDto = {
    id: string;
    name: string;
    type: tpAccountEnum;
    institution: string | null;
    initialBalance: string;
    currentBalance: string;
    projectedBalance: string;
    color: string | null;
    icon: string | null;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
};
