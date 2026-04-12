import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import tanstackQuery from '@tanstack/eslint-plugin-query';

export default [
  { ignores: ['dist', 'prep-scripts/'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser, globals: { ...globals.browser, ...globals.es2020 } },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tanstackQuery.configs['flat/recommended'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'warn',
      // TypeScript handles these; disable to avoid false positives in .ts/.tsx files
      'no-undef': 'off',
      'no-redeclare': 'off',
    },
  },
  prettierConfig,
];
