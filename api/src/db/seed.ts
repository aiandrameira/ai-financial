// Sem tabelas ainda, então sem o que semear. O seed de usuário de desenvolvimento
// (DEV_USER_ID) e categorias padrão entra junto do schema da Fase 1 — ver docs/planning.md.
async function seed() {
    console.log("🌱  Nenhum seed definido ainda — aguardando o schema da Fase 1 (docs/planning.md).")
}

seed().catch((err) => {
    console.error("❌  Seed failed:", err)
    process.exit(1)
})
