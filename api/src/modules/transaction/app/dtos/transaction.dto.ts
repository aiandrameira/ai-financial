export type TransactionDto = {
    id: string
    accountId: string
    categoryId: string | null
    type: "income" | "expense" | "transfer"
    status: "planned" | "pending" | "completed" | "cancelled"
    // Assinado: positivo entra na conta, negativo sai — ver docs/planning.md seção 5.1 e
    // o comentário em infra/repositories/transaction.drizzle.ts.
    amount: string
    description: string | null
    date: string
    tags: string[]
    recurrenceId: string | null
    transferId: string | null
    attachmentUrl: string | null
    createdAt: string
    updatedAt: string
}
