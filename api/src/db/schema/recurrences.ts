import { randomUUIDv7 } from "bun"
import { boolean, date, pgEnum, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core"

import { tpRecurrenceFrequencyEnum } from "@/modules/transaction/domain/enums/tp-recurrence-frequency.enum"

export const recurrenceFrequencyPgEnum = pgEnum(
    "recurrence_frequency",
    Object.values(tpRecurrenceFrequencyEnum) as [tpRecurrenceFrequencyEnum, ...tpRecurrenceFrequencyEnum[]],
)

export const recurrences = pgTable("recurrences", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    frequency: recurrenceFrequencyPgEnum("frequency").notNull(),
    interval: smallint("interval").notNull().default(1),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    nextOccurrence: date("next_occurrence").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
