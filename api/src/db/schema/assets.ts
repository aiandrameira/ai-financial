import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpAssetEnum } from "@/modules/asset/domain/enums"

export const assetTypePgEnum = pgEnum("asset_type", Object.values(tpAssetEnum) as [tpAssetEnum, ...tpAssetEnum[]])

export const assets = pgTable("assets", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: assetTypePgEnum("type").notNull(),
    purchaseValue: numeric("purchase_value", { precision: 14, scale: 2 }).notNull(),
    currentValue: numeric("current_value", { precision: 14, scale: 2 }).notNull(),
    acquiredAt: timestamp("acquired_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
