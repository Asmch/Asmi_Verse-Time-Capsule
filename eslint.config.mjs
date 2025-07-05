import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Disable some strict rules for deployment
      'react/no-unescaped-entities': 'warn', // Change from error to warning
      '@next/next/no-img-element': 'warn', // Change from error to warning
      'react-hooks/exhaustive-deps': 'warn', // Change from error to warning
      'react-hooks/rules-of-hooks': 'error', // Keep this as error
    },
  },
];

export default eslintConfig;
