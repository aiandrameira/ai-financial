import { randomUUIDv7 } from "bun"
import { numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { accounts } from "./accounts"
import { categories } from "./categories"
import { recurrences } from "./recurrences"

export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"])
export const transactionStatusEnum = pgEnum("transaction_status", ["planned", "pending", "completed", "cancelled"])

export const transactions = pgTable("transactions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    accountId: text("account_id")
        .notNull()
        .references(() => accounts.id),
    categoryId: text("category_id").references(() => categories.id),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull().default("completed"),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    tags: text("tags").array().notNull().default([]),
    recurrenceId: text("recurrence_id").references(() => recurrences.id),
    // Sem FK real (evita import circular com transfers.ts) — resolvido via transfers.sourceTransactionId/destinationTransactionId.
    transferId: text("transfer_id"),
    // invoiceId/installmentGroupId entram na Fase 2, junto de credit_cards/credit_card_invoices/installment_groups.
    attachmentUrl: text("attachment_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
