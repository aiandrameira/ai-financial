import { randomUUIDv7 } from "bun"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { transactions } from "./transactions"

export const transfers = pgTable("transfers", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    sourceTransactionId: text("source_transaction_id")
        .notNull()
        .references(() => transactions.id),
    destinationTransactionId: text("destination_transaction_id")
        .notNull()
        .references(() => transactions.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
