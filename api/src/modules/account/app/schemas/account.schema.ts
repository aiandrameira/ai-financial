import { z } from "zod"

import { tpAccountEnum } from "../../domain/enums/tp-account.enum"

export const createAccountSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpAccountEnum),
    institution: z.string().max(120).optional(),
    initialBalance: z.number().finite().default(0),
    color: z.string().max(40).optional(),
    icon: z.string().max(60).optional(),
})

export type CreateAccountSchema = z.infer<typeof createAccountSchema>

export const updateAccountSchema = createAccountSchema.partial()

export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
