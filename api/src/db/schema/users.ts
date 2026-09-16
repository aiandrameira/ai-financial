import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: text()
        .primaryKey()
        .$defaultFn(() => Bun.randomUUIDv7()),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().default(false).notNull(),
    image: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .$onUpdate(() => new Date())
        .notNull()
        .defaultNow(),
})
