import { defineConfig } from "@aiandralves/ai-docs/config"

export default defineConfig({
    title: "AI Financial",
    description: "Documentação funcional e técnica da plataforma AI Financial.",
    docs: "./docs",
    output: "./dist/docs",
    base: "/",
    github: "https://github.com/aiandrameira/ai-financial",
    features: {
        search: true,
        darkMode: true,
        copyCode: true,
        mermaid: true,
    },
})
