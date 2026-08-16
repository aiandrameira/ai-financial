import { randomUUIDv7 } from "bun"
import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { accounts } from "./accounts"

export const savingsGoals = pgTable("savings_goals", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    targetAmount: numeric("target_amount", { precision: 14, scale: 2 }).notNull(),
    targetDate: timestamp("target_date", { withTimezone: true }),
    icon: text("icon"),
    linkedAccountId: text("linked_account_id").references(() => accounts.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
