import { z } from "zod";

import { tpInvestmentMovementEnum } from "../enums";

export const requestInvestmentMovementSchema = z.object({
    type: z.enum(tpInvestmentMovementEnum).default(tpInvestmentMovementEnum.BUY),
    quantity: z.number().min(0).default(0),
    price: z.number().min(0).default(0),
    amount: z.number().positive("Informe um valor maior que zero").default(0),
    date: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
});

export type RequestInvestmentMovementDto = z.infer<typeof requestInvestmentMovementSchema>;

export function makeRequestInvestmentMovement(raw: Partial<RequestInvestmentMovementDto> = {}): RequestInvestmentMovementDto {
    return requestInvestmentMovementSchema.parse(raw);
}

export const investmentMovementSchema = z.object({
    id: z.string(),
    investmentId: z.string(),
    type: z.enum(tpInvestmentMovementEnum),
    quantity: z.string(),
    price: z.string(),
    amount: z.string(),
    date: z.string(),
    createdAt: z.string(),
});

export type InvestmentMovementDto = z.infer<typeof investmentMovementSchema>;
