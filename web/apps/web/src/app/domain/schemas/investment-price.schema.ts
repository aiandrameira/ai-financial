import { z } from "zod";

export const requestInvestmentPriceSchema = z.object({
    price: z.number().positive("Informe um valor maior que zero").default(0),
    referenceDate: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
});

export type RequestInvestmentPriceDto = z.infer<typeof requestInvestmentPriceSchema>;

export function makeRequestInvestmentPrice(raw: Partial<RequestInvestmentPriceDto> = {}): RequestInvestmentPriceDto {
    return requestInvestmentPriceSchema.parse(raw);
}

export const investmentPriceSchema = z.object({
    id: z.string(),
    investmentId: z.string(),
    price: z.string(),
    referenceDate: z.string(),
    source: z.enum(["manual", "automatic"]),
    createdAt: z.string(),
});

export type InvestmentPriceDto = z.infer<typeof investmentPriceSchema>;
