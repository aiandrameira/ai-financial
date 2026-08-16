import { InvestmentAssetDto, RequestInvestmentAssetDto } from "@domain/schemas";

export class InvestmentAdapter {
    static toDto(raw: InvestmentAssetDto): RequestInvestmentAssetDto {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            broker: raw.broker ?? "",
            ticker: raw.ticker ?? "",
        };
    }
}
