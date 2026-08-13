export type AccountDto = {
    id: string
    name: string
    type: "checking" | "savings" | "wallet"
    institution: string | null
    initialBalance: string
    // Derivados a partir das transações — nunca armazenados. Ver docs/planning.md seção 5.1.
    currentBalance: string
    projectedBalance: string
    color: string | null
    icon: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}
