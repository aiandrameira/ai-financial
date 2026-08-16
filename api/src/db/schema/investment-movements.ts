import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpInvestmentMovementEnum } from "@/modules/investment/domain/enums"

import { investmentAssets } from "./investment-assets"

export const investmentMovementTypePgEnum = pgEnum(
    "investment_movement_type",
    Object.values(tpInvestmentMovementEnum) as [tpInvestmentMovementEnum, ...tpInvestmentMovementEnum[]],
)

export const investmentMovements = pgTable("investment_movements", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    investmentId: text("investment_id")
        .notNull()
        .references(() => investmentAssets.id),
    type: investmentMovementTypePgEnum("type").notNull(),
    quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull().default("0"),
    price: numeric("price", { precision: 14, scale: 4 }).notNull().default("0"),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
