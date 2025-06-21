import { defineConfig } from 'eslint-define-config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
   {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
         parser,
         ecmaVersion: 'latest',
         sourceType: 'module',
         parserOptions: {
            ecmaFeatures: {
               jsx: true,
            },
         },
         globals: {
            document: 'readonly',
            window: 'readonly',
         },
      },
      plugins: {
         '@typescript-eslint': typescriptEslintPlugin,
         unicorn: eslintPluginUnicorn,
         react: eslintPluginReact,
         'react-hooks': eslintPluginReactHooks,
      },
      rules: {
         // ✅ JavaScript Rules
         "@typescript-eslint/no-explicit-any": "error",
         // Warn about usage of console.log to keep production clean
         'no-console': 'warn',

         // Warn about debugger statements which should not be in production
         'no-debugger': 'warn',

         // Enforce strict equality === and !==
         eqeqeq: 'error',

         // Require curly braces for all control flow blocks
         curly: ['error', 'all'],

         // Disallow duplicate imports from the same file
         'no-duplicate-imports': 'error',

         // ✅ TypeScript Rules

         // Disable base rule in favor of TS version
         'no-unused-vars': 'off',

         // Warn on unused variables but ignore underscore-prefixed ones
         '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

         // Require explicit return types for functions
         '@typescript-eslint/explicit-function-return-type': 'error',

         // Require explicit access modifiers on class members
         '@typescript-eslint/explicit-member-accessibility': [
            'error',
            { accessibility: 'explicit', overrides: { constructors: 'off' } },
         ],

         // Enforce consistent use of `import type` for type-only imports
         '@typescript-eslint/consistent-type-imports': 'error',

         // ✅ React Rules

         // Prevent false "unused var" warnings in JSX
         'react/jsx-uses-vars': 'error',

         // Ensure hooks are used properly
         'react-hooks/rules-of-hooks': 'error',

         // Warn if dependencies in useEffect/useCallback/etc. are missing
         'react-hooks/exhaustive-deps': 'warn',

         // ✅ Unicorn Rules

         // Enforce kebab-case for filenames
         'unicorn/filename-case': ['error', {
            cases: {
               kebabCase: true,
               pascalCase: true, // ✅ Allow PascalCase for React components
            }
         }],

         // Allow common abbreviations like props, env, i, j, etc.
         'unicorn/prevent-abbreviations': [
            'error',
            {
               allowList: {
                  acc: true,
                  env: true,
                  i: true,
                  j: true,
                  props: true,
                  Props: true,
               },
            },
         ],
      },
   },
]);
