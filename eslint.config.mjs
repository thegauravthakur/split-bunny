import { FlatCompat } from "@eslint/eslintrc"
import reactPlugin from "eslint-plugin-react"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
            react: reactPlugin,
        },
        rules: {
            "@next/next/no-img-element": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "react/jsx-sort-props": [
                "error",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    shorthandLast: false,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
]

export default eslintConfig
