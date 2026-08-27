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

    DEV_USER_ID: z.string().min(1).default("00000000-0000-0000-0000-000000000001"),

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
