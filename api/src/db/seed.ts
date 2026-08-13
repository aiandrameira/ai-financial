import { eq } from "drizzle-orm"

import { env } from "@/env"

import { db } from "./client"
import { categories } from "./schema"

const DEFAULT_CATEGORIES = [
    { name: "Salário", type: "income" as const, icon: "money-dollar-circle", color: "success" },
    { name: "Investimentos", type: "income" as const, icon: "line-chart", color: "success" },
    { name: "Outras receitas", type: "income" as const, icon: "add-circle", color: "success" },

    { name: "Moradia", type: "expense" as const, icon: "home-4", color: "primary" },
    { name: "Alimentação", type: "expense" as const, icon: "restaurant", color: "warning" },
    { name: "Transporte", type: "expense" as const, icon: "car", color: "info" },
    { name: "Saúde", type: "expense" as const, icon: "heart-pulse", color: "destructive" },
    { name: "Lazer", type: "expense" as const, icon: "gamepad", color: "accent" },
    { name: "Educação", type: "expense" as const, icon: "book-open", color: "info" },
    { name: "Assinaturas", type: "expense" as const, icon: "repeat", color: "default" },
    { name: "Outras despesas", type: "expense" as const, icon: "more", color: "default" },
]

async function seed() {
    console.log("🌱  Starting seed...\n")

    for (const category of DEFAULT_CATEGORIES) {
        const [existing] = await db
            .select()
            .from(categories)
            .where(eq(categories.userId, env.DEV_USER_ID))
            .then((rows) => rows.filter((row) => row.name === category.name))

        if (!existing) {
            await db.insert(categories).values({ ...category, userId: env.DEV_USER_ID })
            console.log(`✅  Category: "${category.name}"`)
        } else {
            console.log(`↷  Category "${category.name}" already exists, skipping`)
        }
    }

    console.log("\n🎉  Seed completed successfully!")
}

seed().catch((err) => {
    console.error("❌  Seed failed:", err)
    process.exit(1)
})
