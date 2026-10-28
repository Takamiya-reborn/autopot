// 锅计算:复刻游戏 cooking.lua 的 GetIngredientValues / GetCandidateRecipes / CalculateRecipe
import { INGREDIENTS } from '@/data/ingredients'
import { POT_RECIPES, type CookerId, type Expr, type PotRecipe } from '@/data/recipes'

// 别名表:游戏注册沿用 DS 时代键名,入锅 prefab 需换算
const ALIASES: Record<string, string> = {
  cookedsmallmeat: 'smallmeat_cooked',
  cookedmonstermeat: 'monstermeat_cooked',
  cookedmeat: 'meat_cooked',
}

export interface IngData {
  /** prefab 出现次数 */
  names: Record<string, number>
  /** 标签度数累加 */
  tags: Record<string, number>
}

const valuesById = new Map(INGREDIENTS.map((i) => [i.id, i.values]))

export function getIngredientValues(ids: string[]): IngData {
  const names: Record<string, number> = {}
  const tags: Record<string, number> = {}
  for (const id of ids) {
    const name = ALIASES[id] ?? id
    names[name] = (names[name] ?? 0) + 1
    const values = valuesById.get(id)
    if (!values) throw new Error(`未注册的食材: ${id}`)
    for (const [tag, v] of Object.entries(values)) {
      tags[tag] = (tags[tag] ?? 0) + v
    }
  }
  return { names, tags }
}

// Lua 语义:仅 nil/false 为假,数值恒为真
type LuaVal = number | boolean | null
const truthy = (v: LuaVal): boolean => v !== null && v !== false

export function evalExpr(e: Expr, data: IngData): LuaVal {
  switch (e.t) {
    case 'num':
      return e.v
    case 'bool':
      return e.v
    case 'nil':
      return null
    case 'member':
      return (e.src === 'names' ? data.names : data.tags)[e.key] ?? null
    case 'unop': {
      if (e.op === 'not') return !truthy(evalExpr(e.e, data))
      const v = evalExpr(e.e, data)
      if (typeof v !== 'number') throw new Error('一元 - 作用于 nil')
      return -v
    }
    case 'binop': {
      // and/or 保留操作数值(与 Lua 一致,names.x or 0 之类写法依赖此语义)
      if (e.op === 'and') {
        const l = evalExpr(e.l, data)
        return truthy(l) ? evalExpr(e.r, data) : l
      }
      if (e.op === 'or') {
        const l = evalExpr(e.l, data)
        return truthy(l) ? l : evalExpr(e.r, data)
      }
      const l = evalExpr(e.l, data)
      const r = evalExpr(e.r, data)
      if (typeof l !== 'number' || typeof r !== 'number') {
        throw new Error(`运算 ${e.op} 遇到 nil(游戏内会报错,不应到达)`)
      }
      switch (e.op) {
        case '<':
          return l < r
        case '<=':
          return l <= r
        case '>':
          return l > r
        case '>=':
          return l >= r
        case '==':
          return l === r
        case '~=':
          return l !== r
        case '+':
          return l + r
        case '-':
          return l - r
        case '*':
          return l * r
        case '/':
          return l / r
      }
    }
  }
}

// 全部 test 通过的菜谱(不限优先级):放食材阶段的参考列表
export function getMatchingRecipes(ids: string[], cooker: CookerId = 'cookpot'): PotRecipe[] {
  const data = getIngredientValues(ids)
  return POT_RECIPES.filter((r) => r.cookers.includes(cooker) && truthy(evalExpr(r.test, data)))
}

// 候选菜谱:test 通过的最高优先级一档(开煮时真正可能出的结果)
export function getCandidateRecipes(ids: string[], cooker: CookerId = 'cookpot'): PotRecipe[] {
  const matched = getMatchingRecipes(ids, cooker)
  if (!matched.length) return []
  const top = Math.max(...matched.map((r) => r.priority))
  return matched.filter((r) => r.priority === top)
}

// 同游戏:按 weight 加权随机
export function pickByWeight<T extends { weight: number }>(
  candidates: T[],
  rng: () => number = Math.random,
): T {
  const total = candidates.reduce((s, c) => s + c.weight, 0)
  let val = rng() * total
  for (const c of candidates) {
    val -= c.weight
    if (val <= 0) return c
  }
  const last = candidates[candidates.length - 1]
  if (!last) throw new Error('候选为空')
  return last
}

export function calculateRecipe(
  ids: string[],
  cooker: CookerId = 'cookpot',
  rng: () => number = Math.random,
): PotRecipe | null {
  const candidates = getCandidateRecipes(ids, cooker)
  if (!candidates.length) return null
  return pickByWeight(candidates, rng)
}
