import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpAccountEnum } from "@/modules/account/domain/enums/tp-account.enum"

export const accountTypePgEnum = pgEnum(
    "account_type",
    Object.values(tpAccountEnum) as [tpAccountEnum, ...tpAccountEnum[]],
)

export const accounts = pgTable("accounts", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: accountTypePgEnum("type").notNull(),
    institution: text("institution"),
    initialBalance: numeric("initial_balance", { precision: 14, scale: 2 }).notNull().default("0"),
    color: text("color"),
    icon: text("icon"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
