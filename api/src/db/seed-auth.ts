import { eq } from "drizzle-orm"

import { env } from "@/env"

import { db } from "./client"
import { authAccounts, users } from "./schema"

async function seed() {
    console.log("🌱  Seeding master user...\n")

    const [existing] = await db.select().from(users).where(eq(users.email, env.SEED_MASTER_EMAIL))

    if (existing) {
        console.log(`✅  Master user already exists: ${existing.email}`)
        return
    }

    const [masterUser] = await db
        .insert(users)
        .values({
            name: env.SEED_MASTER_NAME,
            email: env.SEED_MASTER_EMAIL,
            emailVerified: true,
        })
        .returning()

    const hashedPassword = await Bun.password.hash(env.SEED_MASTER_PASSWORD)

    await db.insert(authAccounts).values({
        accountId: masterUser.id,
        providerId: "credential",
        userId: masterUser.id,
        password: hashedPassword,
    })

    console.log(`✅  Master user created: ${masterUser.email}`)
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    })
