import { LoanDto, RequestLoanDto } from "@domain/schemas";

export class LoanAdapter {
    static toDto(raw: LoanDto): RequestLoanDto {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            accountId: raw.accountId,
            principalAmount: Number(raw.principalAmount),
            interestRate: Number(raw.interestRate),
            installmentsTotal: raw.installmentsTotal,
            startDate: raw.startDate.slice(0, 10),
        };
    }
}
