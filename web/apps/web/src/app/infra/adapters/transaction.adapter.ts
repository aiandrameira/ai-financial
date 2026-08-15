import { formatDateDayjs } from "@core/helpers";
import { RequestTransactionDto, TransactionDto } from "@domain/schemas";

export class TransactionAdapter {
    static toDto(raw: TransactionDto): RequestTransactionDto {
        return {
            id: raw.id,
            accountId: raw.accountId ?? "",
            creditCardId: raw.creditCardId ?? "",
            categoryId: raw.categoryId ?? "",
            type: raw.type as RequestTransactionDto["type"],
            amount: Math.abs(Number(raw.amount)),
            description: raw.description ?? "",
            date: formatDateDayjs(raw.date),
            installments: 1,
        };
    }
}
