import type { tpCreditCardNetworkEnum } from "../../domain/enums/tp-credit-card-network.enum"

export type CreditCardDto = {
    id: string
    name: string
    accountId: string
    institution: string | null
    limitAmount: string
    closingDay: number
    dueDay: number
    network: tpCreditCardNetworkEnum
    icon: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
}
