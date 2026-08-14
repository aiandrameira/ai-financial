import { AccountDto, RequestAccountDto } from "@domain/schemas";

export class AccountAdapter {
    static toDto(raw: AccountDto): RequestAccountDto {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            institution: raw.institution ?? "",
            initialBalance: Number(raw.initialBalance),
        };
    }
}
