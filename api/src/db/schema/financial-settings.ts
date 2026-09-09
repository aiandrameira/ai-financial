import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const financialSettings = pgTable("financial_settings", {
    userId: text("user_id").primaryKey(),
    monthlyIncome: numeric("monthly_income", { precision: 14, scale: 2 }).notNull().default("0"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
