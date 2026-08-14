/**
 * dsh-plugin-workspace-files 构建配置。
 *
 * 两个入口：
 * - src/index.ts   → lib/index.mjs  （Host 半，Node 平台：文件 HTTP 桥）
 * - src/client.ts  → lib/client.js （Client 半，浏览器平台：@ 引用 / 预览 / 文件夹浏览）
 *
 * Client 半的特殊性：DSH 客户端模块加载器要求 bundle 是
 * `window.__ModuleLoader__.load({ id, factory })` 包装格式（classic script，
 * factory 为 CJS 风格函数，依赖经注入的 require 解析）。因此用
 * format cjs + banner/footer 把 CJS 产物包进 factory 外壳；react 保持
 * external，运行时从平台 seed 解析。
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { defineConfig } from 'tsdown'

const root = join(dirname(fileURLToPath(import.meta.url)))
const pkgName = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name

const loaderHead = [
  `window.__ModuleLoader__.load({`,
  `\tid: ${JSON.stringify(pkgName)},`,
  `\tfactory: (require) => {`,
  `\t\tvar module = { exports: {} };`,
  `\t\tvar exports = module.exports;`,
].join('\n')

const loaderTail = [
  `\t\treturn module.exports;`,
  `\t}`,
  `});`,
  ``,
].join('\n')

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    dts: true,
    clean: true,
  },
  {
    entry: ['src/client.ts'],
    outDir: 'lib',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2020',
    dts: false,
    deps: { neverBundle: ['react'] },
    outExtensions: () => ({ js: '.js' }),
    banner: { js: loaderHead },
    footer: { js: loaderTail },
  },
])
