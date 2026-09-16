import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3006),
    DATABASE_URL: z.url().startsWith("postgresql://"),

    FRONT_URLS: z
        .string()
        .default("http://localhost:4213")
        .transform((value) => value.split(",").map((url) => url.trim())),

    API_PUBLIC_URL: z.url().default("http://localhost:3006"),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    SESSION_EXPIRES_IN: z.coerce.number().default(60 * 60), // segundos — padrão: 1 hora
    SESSION_COOKIE_CACHE_MAX_AGE: z.coerce.number().default(60 * 5), // segundos — padrão: 5 min

    SEED_MASTER_NAME: z.string().default("Master User"),
    SEED_MASTER_EMAIL: z.email().default("master@example.com"),
    SEED_MASTER_PASSWORD: z.string().default("changeme"),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    RESEND_API_KEY: z.string().default(""),
    DEFAULT_MAIL_FROM: z.string().default(""),

    AI_STORAGE_API_URL: z.string().default(""),
    AI_STORAGE_API_KEY: z.string().default(""),
    AI_STORAGE_ENVIRONMENT_ID: z.string().default(""),

    AI_FLOW_API_URL: z.string().default(""),
    AI_FLOW_API_KEY: z.string().default(""),
})

const parsedEnv = envSchema.parse(typeof Bun !== "undefined" ? Bun.env : process.env)

export const env = {
    ...parsedEnv,
    FRONT_URL: parsedEnv.FRONT_URLS[0],
}
