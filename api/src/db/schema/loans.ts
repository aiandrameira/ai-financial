import { randomUUIDv7 } from "bun"
import { integer, numeric, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpLoanEnum } from "@/modules/loan/domain/enums"

import { accounts } from "./accounts"

export const loanTypePgEnum = pgEnum("loan_type", Object.values(tpLoanEnum) as [tpLoanEnum, ...tpLoanEnum[]])

export const loans = pgTable("loans", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: loanTypePgEnum("type").notNull(),
    principalAmount: numeric("principal_amount", { precision: 14, scale: 2 }).notNull(),
    interestRate: numeric("interest_rate", { precision: 8, scale: 4 }).notNull(),
    installmentsTotal: integer("installments_total").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    accountId: text("account_id")
        .notNull()
        .references(() => accounts.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
