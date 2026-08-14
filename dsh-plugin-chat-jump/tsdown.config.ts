/**
 * dsh-plugin-chat-jump 构建配置。
 * - src/index.ts   → lib/index.mjs  （Host 半，占位空插件）
 * - src/client.ts  → lib/client.js （Client 半，实际功能：对话跳转条）
 * Client 半用 tsdown cjs + banner/footer 包成加载器外壳（同 task-notify）。
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
