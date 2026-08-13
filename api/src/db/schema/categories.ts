import { randomUUIDv7 } from "bun"
import type { AnyPgColumn } from "drizzle-orm/pg-core"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { tpCategoryEnum } from "@/modules/category/domain/enums/tp-category.enum"

export const categoryTypePgEnum = pgEnum(
    "category_type",
    Object.values(tpCategoryEnum) as [tpCategoryEnum, ...tpCategoryEnum[]],
)

export const categories = pgTable("categories", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUIDv7()),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    type: categoryTypePgEnum("type").notNull(),
    parentId: text("parent_id").references((): AnyPgColumn => categories.id),
    icon: text("icon"),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
