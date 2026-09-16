import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const sessions = pgTable(
    "sessions",
    {
        id: text()
            .primaryKey()
            .$defaultFn(() => Bun.randomUUIDv7()),
        userId: text()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        ipAddress: text(),
        expiresAt: timestamp().notNull(),
        token: text().notNull().unique(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .$onUpdate(() => new Date())
            .notNull()
            .defaultNow(),
        userAgent: text(),
    },
    (table) => [index("sessions_user_id_idx").on(table.userId)],
)
