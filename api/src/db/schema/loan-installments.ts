import { randomUUIDv7 } from "bun"
import { integer, numeric, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

import { loans } from "./loans"

export const loanInstallments = pgTable(
    "loan_installments",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUIDv7()),
        userId: text("user_id").notNull(),
        loanId: text("loan_id")
            .notNull()
            .references(() => loans.id),
        number: integer("number").notNull(),
        dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
        amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
        principalPortion: numeric("principal_portion", { precision: 14, scale: 2 }).notNull(),
        interestPortion: numeric("interest_portion", { precision: 14, scale: 2 }).notNull(),
        paidAt: timestamp("paid_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [uniqueIndex("loan_installments_loan_number_idx").on(table.loanId, table.number)],
)
