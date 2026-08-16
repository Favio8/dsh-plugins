/**
 * 冒烟测试：模拟 DSH 客户端模块加载器加载 lib/client.js。
 * 验证 bundle 外壳、exports 与 apply(ctx) 端到端执行不抛错。
 * 用法：node scripts/smoke-client.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── 浏览器全局桩 ──────────────────────────────────────────────
let handoff = null
const makeStyleTag = () => ({ dataset: {}, style: {}, remove() {} })
globalThis.window = {
  __ModuleLoader__: { load: (h) => { handoff = h } },
  setTimeout,
  clearTimeout,
  addEventListener: () => {},
  removeEventListener: () => {},
}
globalThis.document = {
  body: {},
  head: { appendChild: () => {} },
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => makeStyleTag(),
}
globalThis.requestAnimationFrame = () => 1
globalThis.cancelAnimationFrame = () => {}
globalThis.MutationObserver = class {
  observe() {}
  disconnect() {}
}
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() {}
}
globalThis.getComputedStyle = () => ({ paddingLeft: '24px' })

// react 桩：任意属性/调用都返回函数，能过模块加载与 createElement 即可。
const reactStub = new Proxy(function () {}, {
  get: () => reactStub,
  apply: () => reactStub,
})

// ── 加载 bundle ───────────────────────────────────────────────
const code = readFileSync(join(root, 'lib/client.js'), 'utf8')
eval(code)
if (handoff === null) {
  console.error('FAIL: bundle 没有调用 window.__ModuleLoader__.load')
  process.exit(1)
}
console.log('✓ bundle 注册了 factory, id =', handoff.id)

const exportsObj = handoff.factory((spec) => {
  if (spec === 'react') return reactStub
  throw new Error(`unexpected require: ${spec}`)
})
const { inject, apply } = exportsObj
console.log('✓ exports:', Object.keys(exportsObj).join(', '))
console.log('✓ inject =', JSON.stringify(inject))
if (!Array.isArray(inject) || inject.join(',') !== 'slots') {
  console.error('FAIL: inject 不是 ["slots"]')
  process.exit(1)
}

// ── 执行 apply（最小 ctx 桩）─────────────────────────────────
const slotsStub = {
  inject: (_key, cb) => { cb(); return () => {} },
  register: () => () => {},
}
const ctxStub = {
  effect: (cb) => {
    const cleanup = cb()
    return () => { if (typeof cleanup === 'function') cleanup() }
  },
  get: (name) => (name === 'slots' ? slotsStub : undefined),
}
apply(ctxStub)
console.log('✓ apply(ctx) 端到端执行通过（样式注入 + rail overlay 槽位注册无异常）')

console.log('\nSMOKE TEST PASSED')
