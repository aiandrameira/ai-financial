import { randomUUIDv7 } from "bun"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpTransferMethodEnum } from "@/modules/transaction/domain/enums/tp-transfer-method.enum"

import { transactions } from "./transactions"

export const transferMethodPgEnum = pgEnum(
    "transfer_method",
    Object.values(tpTransferMethodEnum) as [tpTransferMethodEnum, ...tpTransferMethodEnum[]],
)

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
    method: transferMethodPgEnum("method").notNull().default(tpTransferMethodEnum.TRANSFER),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
