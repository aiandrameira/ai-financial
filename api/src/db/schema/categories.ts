import { randomUUIDv7 } from "bun"
import type { AnyPgColumn } from "drizzle-orm/pg-core"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"])

export const categories = pgTable("categories", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: categoryTypeEnum("type").notNull(),
    parentId: text("parent_id").references((): AnyPgColumn => categories.id),
    icon: text("icon"),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
