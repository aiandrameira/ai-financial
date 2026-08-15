import { randomUUIDv7 } from "bun"
import { date, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

import { creditCards } from "./credit-cards"

export const creditCardInvoices = pgTable(
    "credit_card_invoices",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUIDv7()),
        userId: text("user_id").notNull(),
        creditCardId: text("credit_card_id")
            .notNull()
            .references(() => creditCards.id),
        referenceMonth: date("reference_month", { mode: "date" }).notNull(),
        closingDate: timestamp("closing_date", { withTimezone: true }).notNull(),
        dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
        paidAt: timestamp("paid_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [uniqueIndex("credit_card_invoices_card_month_idx").on(table.creditCardId, table.referenceMonth)],
)
