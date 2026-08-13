import { randomUUIDv7 } from "bun"
import { boolean, date, pgEnum, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core"

export const recurrenceFrequencyEnum = pgEnum("recurrence_frequency", ["daily", "weekly", "monthly", "yearly"])

export const recurrences = pgTable("recurrences", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    frequency: recurrenceFrequencyEnum("frequency").notNull(),
    interval: smallint("interval").notNull().default(1),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    // Próxima data em que uma ocorrência precisa ser materializada — ver docs/planning.md seção 5.1.
    nextOccurrence: date("next_occurrence").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
