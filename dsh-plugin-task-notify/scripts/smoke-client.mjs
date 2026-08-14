/**
 * 冒烟测试：模拟 DSH 客户端模块加载器加载 lib/client.js。
 * 验证：① bundle 注册了 factory；② factory(require) 产出 { inject, apply }；
 * ③ apply(ctx) 用最小桩可端到端执行不抛错。
 * 用法：node scripts/smoke-client.mjs（临时脚本，验证后删除）
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── 浏览器全局桩 ──────────────────────────────────────────────
let handoff = null
globalThis.window = {
  __ModuleLoader__: {
    load: (h) => {
      handoff = h
    },
  },
}
globalThis.localStorage = {
  _m: new Map(),
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null },
  setItem(k, v) { this._m.set(k, String(v)) },
  removeItem(k) { this._m.delete(k) },
}
globalThis.document = {
  head: { appendChild: () => {} },
  querySelector: () => null,
  createElement: () => ({ dataset: {} }),
}
globalThis.Notification = undefined

// react 桩：任意属性/调用都返回函数，能过模块加载即可
const reactStub = new Proxy(function () {}, {
  get: () => reactStub,
  apply: () => reactStub,
})

// ── 加载 bundle ───────────────────────────────────────────────
const code = readFileSync(join(root, 'lib/client.js'), 'utf8')
// eslint-disable-next-line no-eval
eval(code)
if (handoff === null) {
  console.error('FAIL: bundle 没有调用 window.__ModuleLoader__.load')
  process.exit(1)
}
console.log('✓ bundle 注册了 factory, id =', handoff.id)

// ── 执行 factory（等价于加载器 materialize）──────────────────
const makeRequire = (spec) => {
  if (spec === 'react') return reactStub
  throw new Error(`unexpected require: ${spec}`)
}
const exportsObj = handoff.factory(makeRequire)
const inject = exportsObj.inject
const apply = exportsObj.apply
console.log('✓ exports:', Object.keys(exportsObj).join(', '))
console.log('✓ inject =', JSON.stringify(inject))
if (!Array.isArray(inject) || inject.join(',') !== 'sessions,slots') {
  console.error('FAIL: inject 不是 ["sessions","slots"]')
  process.exit(1)
}
if (typeof apply !== 'function') {
  console.error('FAIL: apply 不是函数')
  process.exit(1)
}

// ── 执行 apply（最小 ctx 桩）─────────────────────────────────
const sessionsStub = {
  list: {
    getSnapshot: () => ({ byId: {} }),
    subscribe: () => () => {},
  },
  open: () => {},
}
const ctxStub = {
  effect: (cb) => {
    const cleanup = cb()
    return () => { if (typeof cleanup === 'function') cleanup() }
  },
  get: (name) => (name === 'sessions' ? sessionsStub : name === 'slots' ? slotsStub : undefined),
}
const slotsStub = {
  inject: (key, cb) => { cb(); return () => {} },
  register: () => () => {},
}
apply(ctxStub)
console.log('✓ apply(ctx) 端到端执行通过（订阅 + 槽位注册路径无异常）')

console.log('\nSMOKE TEST PASSED')
