import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { stTransactionEnum } from "@/modules/transaction/domain/enums/st-transaction.enum"
import { tpTransactionEnum } from "@/modules/transaction/domain/enums/tp-transaction.enum"

import { accounts } from "./accounts"
import { categories } from "./categories"
import { creditCardInvoices } from "./credit-card-invoices"
import { recurrences } from "./recurrences"

export const transactionTypePgEnum = pgEnum(
    "transaction_type",
    Object.values(tpTransactionEnum) as [tpTransactionEnum, ...tpTransactionEnum[]],
)
export const transactionStatusPgEnum = pgEnum(
    "transaction_status",
    Object.values(stTransactionEnum) as [stTransactionEnum, ...stTransactionEnum[]],
)

export const transactions = pgTable("transactions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    accountId: text("account_id").references(() => accounts.id),
    categoryId: text("category_id").references(() => categories.id),
    type: transactionTypePgEnum("type").notNull(),
    status: transactionStatusPgEnum("status").notNull().default(stTransactionEnum.COMPLETED),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    tags: text("tags").array().notNull().default([]),
    recurrenceId: text("recurrence_id").references(() => recurrences.id),
    transferId: text("transfer_id"),
    invoiceId: text("invoice_id").references(() => creditCardInvoices.id),
    attachmentUrl: text("attachment_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
