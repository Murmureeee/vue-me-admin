import globals from 'globals'
import js from '@eslint/js'
import json from '@eslint/json'
import pluginPrettier from 'eslint-plugin-prettier'

import tseslint, { plugin as tsPlugin, parser as tsParser } from 'typescript-eslint'

import vuePlugin from 'eslint-plugin-vue'
import * as vueParser from 'vue-eslint-parser'

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const autoImportConfig = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), '.eslintrc-auto-import.json'),
    'utf-8'
  )
)

export default tseslint.config(
  // 通用 JavaScript 配置
  {
    ...js.configs.recommended,
    // 忽略文件、目录
    ignores: [
      '/dist',
      '/public',
      '/node_modules',
      '**/*.min.js',
      '**/*.config.mjs',
      '**/*.tsbuildinfo',
      '/src/manifest.json',
    ],
    languageOptions: {
      globals: {
        ...globals.browser, // 浏览器变量 (window, document 等)
        ...globals.node, // Node.js 变量 (process, require 等)
        ...autoImportConfig.globals, // 自动导入的全局变量
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf', // 解决换行符冲突
        },
      ],
    },
  },
  // TypeScript 配置
  {
    files: ['**/*.?([cm])ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/ban-types': 'off', //关闭对特定类型定义的检查，允许使用一些不推荐的类型
      '@typescript-eslint/no-redeclare': 'error', // 禁止变量或函数的重复声明
      '@typescript-eslint/no-explicit-any': 'off', // 关闭对使用 'any' 类型的限制，但在实践中应尽量避免使用 'any'
      '@typescript-eslint/prefer-as-const': 'warn', // 建议在可能的情况下使用 'as const' 语法来优化类型推断
      '@typescript-eslint/no-empty-function': 'off', // 关闭对空函数体的检查，允许存在没有操作的函数
      '@typescript-eslint/no-non-null-assertion': 'off', // 关闭对非空断言的限制，但在使用时需确保安全性
      '@typescript-eslint/no-unused-expressions': 'off', // 关闭对未使用的表达式的检查，允许存在未使用的赋值等操作
      '@typescript-eslint/no-unsafe-function-type': 'off', // 关闭对潜在不安全函数类型的检查，允许使用函数类型
      '@typescript-eslint/no-import-type-side-effects': 'error', // 禁止导入类型时产生副作用
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭对模块边界的显式类型定义要求
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-imports': [
        // 要求在导入类型时保持一致性，禁止某些不一致的导入方式
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/prefer-literal-enum-member': [
        // 要求枚举成员尽量使用字面量类型，允许位运算表达式
        'error',
        { allowBitwiseExpressions: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        // 检查未使用的变量，但忽略以下划线开头的参数或变量
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // TypeScript 声明文件的特殊配置
  {
    files: ['**/*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off', // 关闭 eslint 注释相关规则
      'unused-imports/no-unused-vars': 'off', // 忽略未使用的导入
    },
  },
  // JSON 配置
  {
    files: ['**/*.json'],
    ignores: ['package.json', 'tsconfig.*.json'],
    plugins: { json },
    language: 'json/json',
    ...json.configs.recommended,
  },
  // JavaScript 配置
  {
    files: ['**/*.?([cm])js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // 允许 require
    },
  },
  // Vue 配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    processor: vuePlugin.processors['.vue'],
    rules: {
      ...vuePlugin.configs.recommended.rules,
      'vue/no-v-html': 'off', // 允许 v-html
      'vue/require-default-prop': 'off', // 允许没有默认值的 prop
      'vue/multi-word-component-names': 'off', // 关闭组件名称多词要求
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ], // 自闭合标签
    },
  }
)
