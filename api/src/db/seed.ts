import { eq } from "drizzle-orm"

import { tpCategoryEnum } from "@/modules/category/domain/enums"

import { db } from "./client"
import { categories, users } from "./schema"

const DEFAULT_CATEGORIES = [
    { name: "Salário", type: tpCategoryEnum.INCOME, icon: "money-dollar-circle", color: "success" },
    { name: "Investimentos", type: tpCategoryEnum.INCOME, icon: "line-chart", color: "success" },
    { name: "Outras receitas", type: tpCategoryEnum.INCOME, icon: "add-circle", color: "success" },

    { name: "Moradia", type: tpCategoryEnum.EXPENSE, icon: "home-4", color: "primary" },
    { name: "Alimentação", type: tpCategoryEnum.EXPENSE, icon: "restaurant", color: "warning" },
    { name: "Transporte", type: tpCategoryEnum.EXPENSE, icon: "car", color: "info" },
    { name: "Saúde", type: tpCategoryEnum.EXPENSE, icon: "heart-pulse", color: "destructive" },
    { name: "Lazer", type: tpCategoryEnum.EXPENSE, icon: "gamepad", color: "accent" },
    { name: "Educação", type: tpCategoryEnum.EXPENSE, icon: "book-open", color: "info" },
    { name: "Assinaturas", type: tpCategoryEnum.EXPENSE, icon: "repeat", color: "default" },
    { name: "Outras despesas", type: tpCategoryEnum.EXPENSE, icon: "more", color: "default" },
]

async function seed() {
    console.log("🌱  Starting seed...\n")

    const [user] = await db.select({ id: users.id }).from(users).limit(1)
    if (!user) {
        console.log("↷  Nenhum usuário cadastrado ainda — rode `bun run db:seed:auth` primeiro. Pulando categorias.")
        return
    }

    for (const category of DEFAULT_CATEGORIES) {
        const [existing] = await db
            .select()
            .from(categories)
            .where(eq(categories.userId, user.id))
            .then((rows) => rows.filter((row) => row.name === category.name))

        if (!existing) {
            await db.insert(categories).values({ ...category, userId: user.id })
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
