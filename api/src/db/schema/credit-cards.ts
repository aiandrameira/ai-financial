import { randomUUIDv7 } from "bun"
import { integer, numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpCreditCardNetworkEnum } from "@/modules/credit-card/domain/enums"

import { accounts } from "./accounts"

export const creditCardNetworkPgEnum = pgEnum(
    "credit_card_network",
    Object.values(tpCreditCardNetworkEnum) as [tpCreditCardNetworkEnum, ...tpCreditCardNetworkEnum[]],
)

export const creditCards = pgTable("credit_cards", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    accountId: text("account_id")
        .notNull()
        .references(() => accounts.id),
    institution: text("institution"),
    limitAmount: numeric("limit_amount", { precision: 14, scale: 2 }).notNull(),
    closingDay: integer("closing_day").notNull(),
    dueDay: integer("due_day").notNull(),
    network: creditCardNetworkPgEnum("network").notNull().default(tpCreditCardNetworkEnum.OTHER),
    icon: text("icon"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
