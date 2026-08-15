import { CreditCardDto, RequestCreditCardDto } from "@domain/schemas";

export class CreditCardAdapter {
    static toDto(raw: CreditCardDto): RequestCreditCardDto {
        return {
            id: raw.id,
            name: raw.name,
            accountId: raw.accountId,
            institution: raw.institution ?? "",
            limitAmount: Number(raw.limitAmount),
            closingDay: raw.closingDay,
            dueDay: raw.dueDay,
            network: raw.network,
            icon: raw.icon ?? "",
        };
    }
}
