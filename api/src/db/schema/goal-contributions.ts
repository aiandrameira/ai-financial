import { randomUUIDv7 } from "bun"
import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { transactions } from "./transactions"
import { savingsGoals } from "./savings-goals"

export const goalContributions = pgTable("goal_contributions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    goalId: text("goal_id")
        .notNull()
        .references(() => savingsGoals.id),
    transactionId: text("transaction_id").references(() => transactions.id),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
