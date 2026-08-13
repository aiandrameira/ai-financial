import nx from "@nx/eslint-plugin";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: ["**/dist", "**/out-tsc", "node_modules/**", ".nx/**", "**/vite.config.*.timestamp*", ".angular/**"],
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            "no-useless-constructor": "off",
            "no-void": "off",
            "prettier/prettier": "error",
        },
    },
];
