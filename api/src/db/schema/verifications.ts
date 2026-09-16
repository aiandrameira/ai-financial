import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const verifications = pgTable(
    "verifications",
    {
        id: text()
            .primaryKey()
            .$defaultFn(() => Bun.randomUUIDv7()),
        identifier: text().notNull(),
        value: text().notNull(),
        expiresAt: timestamp().notNull(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .$onUpdate(() => new Date())
            .notNull()
            .defaultNow(),
    },
    (table) => [index("verifications_identifier_idx").on(table.identifier)],
)
