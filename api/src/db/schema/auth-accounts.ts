import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

// Nome de tabela e de export deliberadamente diferentes do modelo "account" do better-auth
// (login por senha/Google) para não colidir com a tabela `accounts` já existente no domínio
// financeiro (contas bancárias: corrente/poupança/carteira).
export const authAccounts = pgTable(
    "auth_accounts",
    {
        id: text()
            .primaryKey()
            .$defaultFn(() => Bun.randomUUIDv7()),
        accountId: text().notNull(),
        providerId: text().notNull(),
        userId: text()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text(),
        refreshToken: text(),
        idToken: text(),
        accessTokenExpiresAt: timestamp(),
        refreshTokenExpiresAt: timestamp(),
        scope: text(),
        password: text(),
        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp()
            .$onUpdate(() => new Date())
            .notNull()
            .defaultNow(),
    },
    (table) => [index("auth_accounts_user_id_idx").on(table.userId)],
)
