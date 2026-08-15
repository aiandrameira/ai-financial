import { z } from "zod"

import { tpCreditCardNetworkEnum } from "../../domain/enums/tp-credit-card-network.enum"

export const createCreditCardSchema = z.object({
    name: z.string().min(1).max(120),
    accountId: z.string().min(1),
    institution: z.string().max(120).optional(),
    limitAmount: z.number().positive(),
    closingDay: z.number().int().min(1).max(31),
    dueDay: z.number().int().min(1).max(31),
    network: z.enum(tpCreditCardNetworkEnum).optional(),
    icon: z.string().max(60).optional(),
})

export type CreateCreditCardSchema = z.infer<typeof createCreditCardSchema>

export const updateCreditCardSchema = createCreditCardSchema.partial()

export type UpdateCreditCardSchema = z.infer<typeof updateCreditCardSchema>
