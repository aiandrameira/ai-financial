import { randomUUIDv7 } from "bun"
import { date, numeric, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

import { categories } from "./categories"

export const budgets = pgTable(
    "budgets",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUIDv7()),
        userId: text("user_id").notNull(),
        categoryId: text("category_id")
            .notNull()
            .references(() => categories.id),
        referenceMonth: date("reference_month", { mode: "date" }).notNull(),
        plannedAmount: numeric("planned_amount", { precision: 14, scale: 2 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [uniqueIndex("budgets_category_month_idx").on(table.categoryId, table.referenceMonth)],
)
