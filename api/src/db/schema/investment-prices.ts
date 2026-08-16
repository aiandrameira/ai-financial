import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { investmentAssets } from "./investment-assets"

export const investmentPriceSourcePgEnum = pgEnum("investment_price_source", ["manual", "automatic"])

export const investmentPrices = pgTable("investment_prices", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    investmentId: text("investment_id")
        .notNull()
        .references(() => investmentAssets.id),
    price: numeric("price", { precision: 14, scale: 4 }).notNull(),
    referenceDate: timestamp("reference_date", { withTimezone: true }).notNull(),
    source: investmentPriceSourcePgEnum("source").notNull().default("manual"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
