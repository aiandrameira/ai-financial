import { randomUUIDv7 } from "bun"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpInvestmentEnum } from "@/modules/investment/domain/enums"

export const investmentTypePgEnum = pgEnum("investment_type", Object.values(tpInvestmentEnum) as [tpInvestmentEnum, ...tpInvestmentEnum[]])

export const investmentAssets = pgTable("investment_assets", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: investmentTypePgEnum("type").notNull(),
    broker: text("broker"),
    ticker: text("ticker"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
