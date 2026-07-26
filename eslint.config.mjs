import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import clerkNext from "@clerk/eslint-plugin/next";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@clerk/next': clerkNext },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@clerk/next/require-auth-protection': [
        'error',
        {
          protected: ['src/app/dashboard/**', 'src/actions/dashboard/**'],
          public: ['src/app/sign-in/**', 'src/app/sign-up/**'],
          resources: {
            routeHandlers: true,
            serverFunctions: true,
            serverComponentEntrypoints: false,
          },
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
]);

export default eslintConfig;
