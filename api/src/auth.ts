import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError } from "better-auth/api"

import { db } from "./db/client"
import { authAccounts, sessions, users, verifications } from "./db/schema"
import { env } from "./env"

export const auth = betterAuth({
    basePath: "/auth",
    trustedOrigins: env.FRONT_URLS,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: authAccounts,
            verification: verifications,
        },
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        disableSignUp: true,
        password: {
            hash: (password: string) => Bun.password.hash(password),
            verify: ({ password, hash }: { password: string; hash: string }) => Bun.password.verify(password, hash),
        },
    },
    session: {
        expiresIn: env.SESSION_EXPIRES_IN,
        updateAge: 0,
        cookieCache: {
            enabled: true,
            maxAge: env.SESSION_COOKIE_CACHE_MAX_AGE,
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
        },
    },
    databaseHooks: {
        user: {
            create: {
                // `disableSignUp` acima só cobre o fluxo de e-mail/senha — sem isso, uma conta Google
                // qualquer poderia logar e criar um usuário novo. Este é um app de usuário único: o
                // único usuário válido é o que `db:seed:auth` insere direto no banco (não passa por
                // aqui), então qualquer criação vinda da API é rejeitada.
                before: async () => {
                    throw new APIError("BAD_REQUEST", {
                        message: "Cadastro desabilitado — este é um app de usuário único.",
                    })
                },
            },
        },
    },
})
