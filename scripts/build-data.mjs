// 从本机 DST 游戏本体提取脚本数据，生成 src/data/ingredients.ts
// 用法: node scripts/build-data.mjs [--dst <DST 安装目录>] [--src <已解包脚本目录>] [--out <输出目录>]
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const CACHE = path.join(projectRoot, '.cache', 'game')
const GAME_DIR_NAME = "Don't Starve Together"

// 提取后的目录布局与游戏内一致: cooking.lua / prefabs/ / languages/
const GAME_SCRIPTS = path.join(CACHE, 'scripts')

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag) => {
    const i = args.indexOf(flag)
    return i >= 0 && args[i + 1] ? args[i + 1] : null
  }
  return {
    dst: get('--dst') ? path.resolve(get('--dst')) : null,
    src: get('--src') ? path.resolve(get('--src')) : GAME_SCRIPTS,
    out: get('--out') ? path.resolve(get('--out')) : path.join(projectRoot, 'src', 'data'),
  }
}

// 注册表定位 Steam 安装目录
function findSteamDir() {
  for (const cmd of [
    'reg query "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam" /v InstallPath',
    'reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath',
  ]) {
    try {
      const out = execSync(cmd, { encoding: 'utf8' })
      const m = out.match(/REG_SZ\s+(.+)/)
      if (m) return m[1].trim().replace(/\//g, '\\')
    } catch {
      // 换下一个来源
    }
  }
  return null
}

// libraryfolders.vdf 列出全部游戏库
function findLibraryDirs(steamDir) {
  const vdfPath = path.join(steamDir, 'steamapps', 'libraryfolders.vdf')
  if (!fs.existsSync(vdfPath)) return [steamDir]
  const text = fs.readFileSync(vdfPath, 'utf8')
  const dirs = [...text.matchAll(/"path"\s+"([^"]+)"/g)].map((m) => m[1].replace(/\\\\/g, '\\'))
  return [...new Set([steamDir, ...dirs])]
}

function findGameDir(explicit) {
  if (explicit) return explicit
  const steamDir = findSteamDir()
  if (!steamDir) throw new Error('未找到 Steam，请用 --dst 指定 DST 安装目录')
  for (const lib of findLibraryDirs(steamDir)) {
    const candidate = path.join(lib, 'steamapps', 'common', GAME_DIR_NAME)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error("Steam 游戏库中未找到 Don't Starve Together，请用 --dst 指定安装目录")
}

// 解包 scripts.zip 到 .cache/game
function extractScripts(zipPath) {
  fs.rmSync(CACHE, { recursive: true, force: true })
  fs.mkdirSync(CACHE, { recursive: true })
  if (process.platform === 'win32') {
    const esc = (p) => p.replace(/'/g, "''") // PowerShell 单引号转义
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${esc(zipPath)}' -DestinationPath '${esc(CACHE)}'"`,
      { stdio: 'inherit' },
    )
  } else {
    execSync(`unzip -oq "${zipPath}" -d "${CACHE}"`, { stdio: 'inherit' })
  }
}

const read = (p) => fs.readFileSync(p, 'utf8')

// po 中 STRINGS.NAMES.* 条目: 大写 prefab 键 -> { en, zh }
function parsePoNames(poPath) {
  const text = read(poPath)
  const names = new Map()
  const re =
    /msgctxt "STRINGS\.NAMES\.([A-Z0-9_]+)"\r?\nmsgid "((?:[^"\\]|\\.)*)"\r?\nmsgstr "((?:[^"\\]|\\.)*)"/g
  const unescape = (s) => s.replace(/\\(.)/g, '$1')
  for (const m of text.matchAll(re)) {
    if (!names.has(m[1])) {
      names.set(m[1], { en: unescape(m[2]), zh: unescape(m[3]).trim() })
    }
  }
  return names
}

// cooking.lua 中全部 AddIngredientValues({...}, {tag=值}, cancook, candry) 调用
function parseCookingLua(luaPath) {
  const text = read(luaPath)
  // 首参可能是 local 变量表(veggies/fruits/mushrooms/driedleaves),先收集定义
  const vars = {}
  for (const m of text.matchAll(/local\s+(\w+)\s*=\s*\{([^}]*)\}/g)) {
    vars[m[1]] = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])
  }
  const re =
    /AddIngredientValues\(\s*(?:\{([^}]+)\}|([A-Za-z_]\w*))\s*,\s*\{([^}]+)\}\s*(?:,\s*(true|false))?(?:,\s*(true|false))?\s*\)/g
  const items = []
  for (const m of text.matchAll(re)) {
    const names =
      m[1] !== undefined
        ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
        : vars[m[2]] ?? (() => { throw new Error(`未知的材料变量: ${m[2]}`) })()
    const tags = {}
    for (const t of m[3].matchAll(/(\w+)\s*=\s*([\d.]+)/g)) {
      tags[t[1]] = Number(t[2])
    }
    items.push({ names, tags, cancook: m[4] === 'true', candry: m[5] === 'true' })
  }
  return items
}

// oceanfishdef.lua 中各海洋鱼的 cooker_ingredient_value（常量或内联表）
function parseOceanfishDef(luaPath) {
  const text = read(luaPath)
  const consts = {}
  for (const m of text.matchAll(/(COOKER_INGREDIENT_\w+)\s*=\s*\{([^}]*)\}/g)) {
    consts[m[1]] = Object.fromEntries(
      [...m[2].matchAll(/(\w+)\s*=\s*([\d.]+)/g)].map((t) => [t[1], Number(t[2])]),
    )
  }
  const defRe = /oceanfish_(small|medium)_(\d+)\s*=\s*\{/g
  const valueRe = /cooker_ingredient_value\s*=\s*(COOKER_INGREDIENT_\w+|\{[^}]*\})/
  const items = []
  const matches = [...text.matchAll(defRe)]
  matches.forEach((m, i) => {
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    const v = text.slice(m.index, end).match(valueRe)
    if (!v) return
    const tags = v[1].startsWith('{')
      ? Object.fromEntries(
          [...v[1].matchAll(/(\w+)\s*=\s*([\d.]+)/g)].map((t) => [t[1], Number(t[2])]),
        )
      : consts[v[1]]
    if (tags) {
      // 游戏注册的是 fish_def.prefab.."_inv"，def 键即 prefab 名
      items.push({ id: `oceanfish_${m[1]}_${m[2]}_inv`, tags })
    }
  })
  return items
}

// ---------- 锅菜谱提取:解析 test 函数为表达式 AST ----------

// 词法:标识符/数字/运算符,出现任何其它字符立即报错
function tokenizeExpr(src) {
  const re = /\s*([A-Za-z_]\w*|\d+\.\d*|\.\d+|\d+|==|~=|<=|>=|[<>+\-*/().])/y
  const tokens = []
  let i = 0
  while (i < src.length) {
    re.lastIndex = i
    const m = re.exec(src)
    if (!m) {
      if (/^\s*$/.test(src.slice(i))) break
      throw new Error(`无法词法解析: "...${src.slice(i, i + 30)}"`)
    }
    tokens.push(m[1])
    i = re.lastIndex
  }
  return tokens
}

const LUA_KEYWORDS = new Set(['and', 'or', 'not', 'nil', 'true', 'false'])
const CMP_OPS = new Set(['==', '~=', '<', '<=', '>', '>='])

// 递归下降解析,严格按 Lua 优先级: or < and < 比较 < 加减 < 乘除 < 一元 < 原子
function parseExprTokens(tokens) {
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]
  const expect = (t) => {
    if (tokens[pos] !== t) throw new Error(`期望 "${t}",实际 "${tokens[pos] ?? 'EOF'}"`)
    pos++
  }

  const parsePrimary = () => {
    const t = peek()
    if (t === undefined) throw new Error('表达式意外结束')
    if (t === '(') {
      next()
      const e = parseOr()
      expect(')')
      return e
    }
    if (/^\d/.test(t) || /^\.\d/.test(t)) {
      next()
      return { t: 'num', v: Number(t) }
    }
    if (t === 'nil') {
      next()
      return { t: 'nil' }
    }
    if (t === 'true' || t === 'false') {
      next()
      return { t: 'bool', v: t === 'true' }
    }
    if (t === 'names' || t === 'tags') {
      next()
      expect('.')
      const key = next()
      if (!/^[A-Za-z_]\w*$/.test(key) || LUA_KEYWORDS.has(key)) {
        throw new Error(`非法成员名: ${key}`)
      }
      return { t: 'member', src: t, key }
    }
    throw new Error(`不支持的语法: ${t}`)
  }

  const parseUnary = () => {
    const t = peek()
    if (t === 'not' || t === '-') {
      next()
      return { t: 'unop', op: t, e: parseUnary() }
    }
    return parsePrimary()
  }

  const binaryChain = (sub, ops, build) => {
    let left = sub()
    while (ops.has(peek())) {
      const op = next()
      left = build(op, left, sub())
    }
    return left
  }

  const parseMul = () => binaryChain(parseUnary, new Set(['*', '/']), (op, l, r) => ({ t: 'binop', op, l, r }))
  const parseAdd = () => binaryChain(parseMul, new Set(['+', '-']), (op, l, r) => ({ t: 'binop', op, l, r }))
  const parseCmp = () => {
    const left = parseAdd()
    if (CMP_OPS.has(peek())) {
      const op = next()
      const right = parseAdd()
      if (CMP_OPS.has(peek())) throw new Error('Lua 比较运算不可链式')
      return { t: 'binop', op, l: left, r: right }
    }
    return left
  }
  const parseAnd = () => binaryChain(parseCmp, new Set(['and']), (op, l, r) => ({ t: 'binop', op, l, r }))
  const parseOr = () => binaryChain(parseAnd, new Set(['or']), (op, l, r) => ({ t: 'binop', op, l, r }))

  const ast = parseOr()
  if (pos !== tokens.length) throw new Error(`存在未消费的 token: ${tokens.slice(pos).join(' ')}`)
  return ast
}

function parseLuaExpr(src) {
  return parseExprTokens(tokenizeExpr(src))
}

// 全括号序列化,供往返校验
function serializeExpr(e) {
  switch (e.t) {
    case 'num':
      return String(e.v)
    case 'bool':
      return e.v ? 'true' : 'false'
    case 'nil':
      return 'nil'
    case 'member':
      return `${e.src}.${e.key}`
    case 'unop':
      return `(${e.op} ${serializeExpr(e.e)})`
    case 'binop':
      return `(${serializeExpr(e.l)} ${e.op} ${serializeExpr(e.r)})`
  }
}

function deepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b || a === null || b === null) return false
  if (typeof a !== 'object') return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]))
}

// 跳过空白与 Lua 行注释
function skipTrivia(text, i) {
  while (i < text.length) {
    if (/\s/.test(text[i])) {
      i++
    } else if (text.startsWith('--', i)) {
      const nl = text.indexOf('\n', i)
      i = nl < 0 ? text.length : nl + 1
    } else {
      break
    }
  }
  return i
}

// 字符串与注释感知的花括号配对
function matchBrace(text, i) {
  let depth = 0
  while (i < text.length) {
    const c = text[i]
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < text.length && text[i] !== q) i += text[i] === '\\' ? 2 : 1
      i++
    } else if (text.startsWith('--', i)) {
      const nl = text.indexOf('\n', i)
      i = nl < 0 ? text.length : nl
    } else if (c === '{') {
      depth++
      i++
    } else if (c === '}') {
      depth--
      if (depth === 0) return i
      i++
    } else {
      i++
    }
  }
  throw new Error('花括号不配对')
}

// 数字字段,缺失返回 null,非数字字面量报错
function numField(block, field) {
  const num = block.match(new RegExp(`\\b${field}\\s*=\\s*(-?(?:\\d+\\.?\\d*|\\.\\d+))\\b`))
  if (num) return Number(num[1])
  const raw = block.match(new RegExp(`\\b${field}\\s*=\\s*([^,\\n}]+)`))
  if (raw) throw new Error(`字段 ${field} 非数字字面量: ${raw[1].trim()}`)
  return null
}

// tuning.lua 常量求值:收集纯算术定义行,按引用递归求值(模块级,由 main 初始化)
let tuningValue = null

function makeTuningResolver(luaPath) {
  const text = read(luaPath)
  const defs = new Map()
  for (const m of text.matchAll(/^\s*(?:local\s+)?([A-Za-z_]\w*)\s*=\s*([^\n]+)$/gm)) {
    // CRLF 源文件:先去掉行尾 \r,否则 /--.*$/ 因 . 不匹配 \r 而失效
    const expr = m[2].replace(/\r$/, '').replace(/--.*$/, '').trim().replace(/,$/, '').trim()
    if (/^[\w\s.+\-*/()]+$/.test(expr)) defs.set(m[1], expr)
  }
  const cache = new Map()
  const evalName = (name, stack) => {
    if (cache.has(name)) return cache.get(name)
    const expr = defs.get(name)
    if (expr === undefined || stack.has(name)) return undefined
    stack.add(name)
    try {
      const js = expr.replace(/[A-Za-z_]\w*/g, (id) => {
        const v = evalName(id, stack)
        if (v === undefined) throw new Error(`unresolved: ${id}`)
        return `(${v})`
      })
      if (!/^[\d\s.()+\-*/]*$/.test(js)) return undefined
      const v = Function(`"use strict"; return (${js})`)()
      cache.set(name, v)
      return v
    } catch {
      return undefined
    } finally {
      stack.delete(name)
    }
  }
  return (name) => evalName(name, new Set())
}

// 数值字段(health/hunger/sanity/perishtime 等):支持 TUNING 常量与算术,缺失返回 null
function statField(block, field) {
  const m = block.match(new RegExp(`\\b${field}\\s*=\\s*([^,\\n}]+)`))
  if (!m) return null
  const raw = m[1].replace(/\r$/, '').replace(/--.*$/, '').trim()
  if (raw === 'nil') return null
  const js = raw.replace(/\bTUNING\.([A-Za-z_]\w*)/g, (_, k) => {
    const v = tuningValue(k)
    if (v === undefined) throw new Error(`tuning.lua 缺少常量 ${k}`)
    return `(${v})`
  })
  if (!/^[\d\s.()+\-*/]*$/.test(js)) throw new Error(`字段 ${field} 无法求值: ${raw}`)
  return Function(`"use strict"; return (${js})`)()
}

// 食物类型(FOODTYPE.* 枚举名),缺失返回 null
function foodTypeField(block) {
  const m = block.match(/\bfoodtype\s*=\s*FOODTYPE\.([A-Za-z_]\w*)/)
  return m ? m[1] : null
}

function parseRecipeEntry(name, block, cookers) {
  const tm = block.match(
    /\btest\s*=\s*function\s*\(\s*cooker\s*,\s*names\s*,\s*tags\s*\)\s*return\b([\s\S]*?)\bend\b/,
  )
  if (!tm) throw new Error(`菜谱 ${name} 的 test 函数无法提取`)
  // 行尾可能带 Lua 注释
  const body = tm[1].replace(/--[^\n]*/g, '').trim()
  const ast = parseLuaExpr(body)
  // 往返校验:序列化后重解析,AST 必须一致
  const reparsed = parseLuaExpr(serializeExpr(ast))
  if (!deepEqual(ast, reparsed)) throw new Error(`菜谱 ${name} 表达式往返校验失败`)

  return {
    id: name,
    cookers,
    priority: numField(block, 'priority') ?? 0,
    weight: numField(block, 'weight') ?? 1,
    cooktime: numField(block, 'cooktime') ?? 1,
    stats: {
      health: statField(block, 'health'),
      hunger: statField(block, 'hunger'),
      sanity: statField(block, 'sanity'),
    },
    // 保质期:stewer 优先取 cookpot_perishtime(游戏秒,展示时换算天)
    perishtime: statField(block, 'cookpot_perishtime') ?? statField(block, 'perishtime'),
    foodtype: foodTypeField(block),
    test: ast,
  }
}

// 提取整个菜谱表(local xxx = { ... })
function extractRecipeTable(luaPath, cookers) {
  const text = read(luaPath)
  const decl = /local\s+\w+\s*=\s*\{/.exec(text)
  if (!decl) throw new Error(`${luaPath} 未找到菜谱表`)
  let i = decl.index + decl[0].length - 1 + 1
  const recipes = []
  while (true) {
    i = skipTrivia(text, i)
    while (text[i] === ',' || text[i] === ';') {
      i = skipTrivia(text, i + 1)
    }
    if (text[i] === undefined) throw new Error(`${luaPath} 菜谱表未正常闭合`)
    if (text[i] === '}') break
    const m = /^[A-Za-z_]\w*\s*=\s*\{/.exec(text.slice(i))
    if (!m) throw new Error(`${luaPath} 无法解析条目 @${i}: "${text.slice(i, i + 40)}"`)
    const name = m[0].match(/^[A-Za-z_]\w*/)[0]
    const bodyStart = i + m[0].length - 1
    const bodyEnd = matchBrace(text, bodyStart)
    recipes.push(parseRecipeEntry(name, text.slice(bodyStart + 1, bodyEnd), cookers))
    i = bodyEnd + 1
  }
  return recipes
}

function main() {
  const { dst, src, out } = parseArgs()

  // 提取（--src 可跳过）
  if (src === GAME_SCRIPTS) {
    const gameDir = findGameDir(dst)
    const zipPath = path.join(gameDir, 'data', 'databundles', 'scripts.zip')
    if (!fs.existsSync(zipPath)) throw new Error(`未找到 scripts.zip: ${zipPath}`)
    console.log(`DST 安装目录: ${gameDir}`)
    extractScripts(zipPath)
  }

  const po = parsePoNames(path.join(src, 'languages', 'chinese_s.po'))

  // 注册表沿用 DS 时代键名（meat_cooked 等），实际入锅 prefab 是 DST 命名（cookedmeat 等）
  const cookedPrefabNames = {
    meat: 'cookedmeat',
    monstermeat: 'cookedmonstermeat',
    smallmeat: 'cookedsmallmeat',
  }
  const registry = []
  const skipped = []
  // 无显示名的物品视为不存在（如 honey_cooked），不入库
  const addEntry = (id, tags) => {
    const names = po.get(id.toUpperCase())
    if (!names) {
      skipped.push(id)
      return
    }
    registry.push({ id, tags, en: names.en, zh: names.zh })
  }

  // 基础材料 + cooked/dried 变体（与 cooking.lua 的 AddIngredientValues 行为一致）
  for (const item of parseCookingLua(path.join(src, 'cooking.lua'))) {
    for (const name of item.names) {
      addEntry(name, { ...item.tags })
      if (item.cancook) {
        addEntry(cookedPrefabNames[name] ?? `${name}_cooked`, { ...item.tags, precook: 1 })
      }
      if (item.candry) {
        addEntry(`${name}_dried`, { ...item.tags, dried: 1 })
      }
    }
  }

  // 海洋鱼 _inv 物品
  for (const fish of parseOceanfishDef(path.join(src, 'prefabs', 'oceanfishdef.lua'))) {
    addEntry(fish.id, { ...fish.tags })
  }

  // 归类：fish 在 meat 之前，池塘鱼/鱼肉同时带 meat+fish，应归为鱼类
  const categoryOrder = [
    'fish',
    'meat',
    'egg',
    'fruit',
    'veggie',
    'dairy',
    'sweetener',
    'fat',
    'magic',
    'seed',
    'decoration',
    'frozen',
    'inedible',
  ]
  const categoryOf = (tags) => categoryOrder.find((t) => (tags[t] ?? 0) > 0) ?? 'inedible'

  // 保持 cooking.lua 的注册顺序（游戏内部顺序），不重排
  const ingredients = registry.map((e) => ({
    id: e.id,
    name: e.zh || e.en,
    nameEn: e.en,
    category: categoryOf(e.tags),
    values: Object.fromEntries(Object.entries(e.tags).sort()),
  }))

  const header = `// 由 scripts/build-data.mjs 自动生成，请勿手动编辑
// 数据源: DST 游戏本体脚本（${path.relative(projectRoot, src)}）
// 生成时间: ${new Date().toISOString().slice(0, 10)}
`

  const ts = `${header}
/** 食物值标签（数值为该物品提供的对应"度数"） */
export type FoodTag =
  | "meat" // 肉
  | "fish" // 鱼
  | "egg" // 蛋
  | "fruit" // 果
  | "veggie" // 菜
  | "dairy" // 奶
  | "sweetener" // 糖
  | "fat" // 油脂
  | "monster" // 怪物
  | "inedible" // 不可食用（填充）
  | "magic" // 魔法
  | "seed" // 种子
  | "decoration" // 装饰
  | "frozen" // 冰
  | "precook" // 下锅前已烤熟
  | "dried"; // 下锅前已晒干

export type FoodValues = Partial<Record<FoodTag, number>>;

export type IngredientCategory =
  | "meat"
  | "fish"
  | "egg"
  | "fruit"
  | "veggie"
  | "dairy"
  | "sweetener"
  | "fat"
  | "magic"
  | "seed"
  | "decoration"
  | "frozen"
  | "inedible";

export interface Ingredient {
  /** 游戏 prefab id（即放入锅中时的名字） */
  id: string;
  /** 中文名（官方简体汉化） */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 归类（按主要食物值标签判定） */
  category: IngredientCategory;
  /** 食物值 */
  values: FoodValues;
}

export const INGREDIENTS: Ingredient[] = ${JSON.stringify(ingredients, null, 2)};

/** 标签中文名（UI 用） */
export const FOOD_TAG_LABELS: Record<FoodTag, string> = {
  meat: "肉",
  fish: "鱼",
  egg: "蛋",
  fruit: "果",
  veggie: "菜",
  dairy: "奶",
  sweetener: "糖",
  fat: "油脂",
  monster: "怪物",
  inedible: "填充",
  magic: "魔法",
  seed: "种子",
  decoration: "装饰",
  frozen: "冰",
  precook: "预熟",
  dried: "干制",
};

/** 分类中文名（UI 用） */
export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  meat: "肉类",
  fish: "鱼类",
  egg: "蛋类",
  fruit: "水果",
  veggie: "蔬菜",
  dairy: "奶制品",
  sweetener: "甜味剂",
  fat: "油脂",
  magic: "魔法材料",
  seed: "种子",
  decoration: "装饰物",
  frozen: "冰",
  inedible: "填充物",
};
`

  fs.mkdirSync(out, { recursive: true })
  const outFile = path.join(out, 'ingredients.ts')
  fs.writeFileSync(outFile, ts, 'utf8')

  // 锅菜谱:注册关系与 cooking.lua 中 AddCookerRecipe 一致
  tuningValue = makeTuningResolver(path.join(src, 'tuning.lua'))
  const baseCookers = ['cookpot', 'portablecookpot', 'archive_cookpot']
  const recipes = [
    ...extractRecipeTable(path.join(src, 'preparedfoods.lua'), baseCookers),
    ...extractRecipeTable(path.join(src, 'preparedfoods_warly.lua'), ['portablecookpot']),
    ...extractRecipeTable(path.join(src, 'preparednonfoods.lua'), baseCookers),
  ]
  const dupIds = recipes.filter((r, i) => recipes.findIndex((x) => x.id === r.id) !== i)
  if (dupIds.length) throw new Error(`菜谱 id 重复: ${[...new Set(dupIds.map((r) => r.id))].join(', ')}`)

  const namedRecipes = recipes.map((r) => {
    const names = po.get(r.id.toUpperCase())
    if (!names) console.log(`  提示: 菜谱 ${r.id} 无显示名,回退用 id`)
    return { ...r, name: names?.zh || r.id, nameEn: names?.en || r.id }
  })

  const recipeTs = `${header}
/** 锅类型(与游戏 AddCookerRecipe 的 cooker 参数一致) */
export type CookerId = "cookpot" | "portablecookpot" | "archive_cookpot";

export type BinOp =
  | "and"
  | "or"
  | "=="
  | "~="
  | "<"
  | "<="
  | ">"
  | ">="
  | "+"
  | "-"
  | "*"
  | "/";

/** test 判定表达式的 AST(游戏源函数解析而来,Lua 语义求值) */
export type Expr =
  | { t: "num"; v: number }
  | { t: "bool"; v: boolean }
  | { t: "nil" }
  | { t: "member"; src: "names" | "tags"; key: string }
  | { t: "unop"; op: "not" | "-"; e: Expr }
  | { t: "binop"; op: BinOp; l: Expr; r: Expr };

export interface PotRecipe {
  /** 菜品 prefab id */
  id: string;
  /** 中文名(官方简体汉化) */
  name: string;
  /** 英文名 */
  nameEn: string;
  /** 注册到的锅 */
  cookers: CookerId[];
  /** 优先级(仅最高一档参与结果) */
  priority: number;
  /** 同档随机权重 */
  weight: number;
  /** 烹饪时长倍率 */
  cooktime: number;
  /** 食用三维变化(生命/饥饿/理智),按菜谱字段原样提取 */
  stats: { health: number | null; hunger: number | null; sanity: number | null };
  /** 保质期(游戏秒,480 秒 = 1 游戏天);null 为不腐坏 */
  perishtime: number | null;
  /** 食物类型(FOODTYPE 枚举名) */
  foodtype: string | null;
  /** 判定表达式 */
  test: Expr;
}

export const POT_RECIPES: PotRecipe[] = ${JSON.stringify(namedRecipes, null, 2)};
`

  const recipesFile = path.join(out, 'recipes.ts')
  fs.writeFileSync(recipesFile, recipeTs, 'utf8')

  const counts = {}
  for (const i of ingredients) counts[i.category] = (counts[i.category] ?? 0) + 1
  console.log(`✔ 写出 ${outFile}`)
  console.log(`✔ 写出 ${recipesFile}（${namedRecipes.length} 条菜谱）`)
  console.log(`  共 ${ingredients.length} 条材料条目（含熟制/干制变体）`)
  for (const [k, v] of Object.entries(counts).sort()) console.log(`    ${k}: ${v}`)
  if (skipped.length) console.log(`  跳过不存在的物品变体: ${skipped.join(', ')}`)
}

main()
