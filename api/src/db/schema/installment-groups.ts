import { randomUUIDv7 } from "bun"
import { integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { creditCards } from "./credit-cards"

export const installmentGroups = pgTable("installment_groups", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    creditCardId: text("credit_card_id")
        .notNull()
        .references(() => creditCards.id),
    description: text("description"),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    installmentsTotal: integer("installments_total").notNull(),
    purchaseDate: timestamp("purchase_date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
