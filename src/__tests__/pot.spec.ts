import { describe, it, expect, vi } from 'vitest'

import { POT_RECIPES } from '../data/recipes'
import type { BinOp, Expr, PotRecipe } from '../data/recipes'
import {
  getIngredientValues,
  evalExpr,
  getCandidateRecipes,
  pickByWeight,
  calculateRecipe,
} from '../lib/pot'

const byId = (id: string): PotRecipe => {
  const r = POT_RECIPES.find((r) => r.id === id)
  if (!r) throw new Error(`缺少菜谱 ${id}`)
  return r
}
const ids = (recipes: PotRecipe[]) => recipes.map((r) => r.id)

const m = (src: 'names' | 'tags', key: string): Expr => ({ t: 'member', src, key })
const num = (v: number): Expr => ({ t: 'num', v })
const bin = (op: BinOp, l: Expr, r: Expr): Expr => ({ t: 'binop', op, l, r })

describe('菜谱数据完整性', () => {
  it('解析出全部 81 条官方菜谱', () => {
    expect(POT_RECIPES.length).toBe(81)
  })

  it('id 唯一、权重与优先级为数值', () => {
    const all = POT_RECIPES.map((r) => r.id)
    expect(new Set(all).size).toBe(all.length)
    for (const r of POT_RECIPES) {
      expect(r.priority).toBeTypeOf('number')
      expect(r.weight).toBeGreaterThan(0)
      expect(r.cooktime).toBeGreaterThan(0)
      expect(r.cookers.length).toBeGreaterThan(0)
    }
  })

  it('wetgoop 兜底注册在所有锅且优先级最低', () => {
    const wetgoop = byId('wetgoop')
    expect(wetgoop.test).toEqual({ t: 'bool', v: true })
    expect(wetgoop.cookers).toContain('cookpot')
    expect(wetgoop.priority).toBe(Math.min(...POT_RECIPES.map((r) => r.priority)))
  })

  it('Warly 菜只注册给便携锅', () => {
    const portableOnly = POT_RECIPES.filter((r) => !r.cookers.includes('cookpot'))
    for (const r of portableOnly) expect(r.cookers).toEqual(['portablecookpot'])
  })
})

describe('getIngredientValues', () => {
  it('按标签累加度数', () => {
    const data = getIngredientValues(['meat', 'meat', 'drumstick'])
    expect(data.names).toEqual({ meat: 2, drumstick: 1 })
    expect(data.tags.meat).toBe(2.5)
  })

  it('熟肉 prefab 走别名表', () => {
    const data = getIngredientValues(['cookedmeat'])
    expect(data.names).toEqual({ meat_cooked: 1 })
    expect(data.tags.meat).toBe(1)
  })

  it('未知食材报错', () => {
    expect(() => getIngredientValues(['not_an_ingredient'])).toThrow('未注册的食材')
  })
})

describe('evalExpr Lua 语义', () => {
  const empty = { names: {}, tags: {} }

  it('or 保留操作数值而非布尔', () => {
    expect(evalExpr(bin('or', m('names', 'kelp'), num(0)), empty)).toBe(0)
    expect(evalExpr(bin('or', m('names', 'kelp'), num(0)), { names: { kelp: 2 }, tags: {} })).toBe(2)
  })

  it('and 短路并返回右值', () => {
    expect(evalExpr(bin('and', num(0), num(7)), empty)).toBe(7)
    expect(evalExpr(bin('and', m('names', 'kelp'), num(7)), empty)).toBe(null)
  })

  it('数值恒为真,仅 nil/false 为假', () => {
    expect(evalExpr({ t: 'unop', op: 'not', e: num(0) }, empty)).toBe(false)
    expect(evalExpr({ t: 'unop', op: 'not', e: m('names', 'kelp') }, empty)).toBe(true)
  })

  it('比较遇到 nil 抛错(游戏内该路径会报错)', () => {
    expect(() => evalExpr(bin('>', m('tags', 'meat'), num(2)), empty)).toThrow('遇到 nil')
  })

  it('算术与比较组合', () => {
    const data = { names: { kelp: 1, kelp_cooked: 1 }, tags: {} }
    const expr = bin('>=', bin('+', bin('or', m('names', 'kelp'), num(0)), bin('or', m('names', 'kelp_cooked'), num(0))), num(2))
    expect(evalExpr(expr, data)).toBe(true)
    expect(evalExpr(expr, { names: { kelp: 1 }, tags: {} })).toBe(false)
  })
})

describe('getCandidateRecipes', () => {
  it('无其它候选时只剩 wetgoop 兜底', () => {
    expect(ids(getCandidateRecipes(['nightmarefuel', 'nightmarefuel', 'nightmarefuel', 'nightmarefuel']))).toEqual([
      'wetgoop',
    ])
  })

  it('纯填充出牛饲料(优先级 -5 高于 wetgoop)', () => {
    expect(calculateRecipe(['twigs', 'twigs', 'twigs', 'twigs'])?.id).toBe('beefalofeed')
  })

  it('肉丸:一肉三浆果', () => {
    expect(calculateRecipe(['meat', 'berries', 'berries', 'berries'])?.id).toBe('meatballs')
  })

  it('别名:熟肉与生肉结果一致', () => {
    expect(calculateRecipe(['cookedmeat', 'berries', 'berries', 'berries'])?.id).toBe('meatballs')
  })

  it('优先级档位:蜂蜜火腿压过肉丸', () => {
    const candidates = getCandidateRecipes(['honey', 'meat', 'meat', 'meat'])
    expect(ids(candidates)).toEqual(['honeyham'])
  })

  it('肉度 1.5 为蜂蜜火腿与蜂蜜金块的边界', () => {
    expect(calculateRecipe(['honey', 'honey', 'smallmeat', 'smallmeat'])?.id).toBe('honeynuggets')
    expect(calculateRecipe(['honey', 'meat', 'meat', 'meat'])?.id).toBe('honeyham')
  })

  it('糖度阈值:太妃糖', () => {
    expect(calculateRecipe(['honey', 'honey', 'honey', 'berries'])?.id).toBe('taffy')
  })

  it('test 引用熟制 prefab 名:南瓜饼', () => {
    expect(calculateRecipe(['pumpkin', 'honey', 'honey', 'berries'])?.id).toBe('pumpkincookie')
  })

  it('鱼条:不可食用度数 <= 1', () => {
    expect(calculateRecipe(['fish', 'twigs', 'berries', 'berries'])?.id).toBe('fishsticks')
    expect(calculateRecipe(['fish', 'twigs', 'twigs', 'twigs'])?.id).toBe('wetgoop')
  })

  it('names 计数比较:噩梦派只属于便携锅', () => {
    const put = ['nightmarefuel', 'nightmarefuel', 'potato', 'onion']
    expect(ids(getCandidateRecipes(put, 'cookpot'))).toEqual(['wetgoop'])
    expect(getCandidateRecipes(put, 'portablecookpot').map((r) => r.id)).toContain('nightmarepie')
  })

  it('蛋数比较:土豆舒芙蕾(便携锅)', () => {
    expect(calculateRecipe(['potato', 'potato', 'bird_egg', 'bird_egg'], 'portablecookpot')?.id).toBe('potatosouffle')
  })

  it('candidates 不含未通过 test 的菜谱', () => {
    for (const r of getCandidateRecipes(['meat', 'berries', 'berries', 'berries'])) {
      expect(r.id).not.toBe('bonestew')
    }
  })
})

describe('pickByWeight 加权随机', () => {
  const two = [
    { id: 'a', weight: 3 },
    { id: 'b', weight: 1 },
  ]

  it('按权重比例落在随机数区间', () => {
    expect(pickByWeight(two, () => 0.5).id).toBe('a')
    expect(pickByWeight(two, () => 0.9).id).toBe('b')
  })

  it('边界 val <= 0 归前一个候选(与游戏一致)', () => {
    expect(pickByWeight(two, () => 0.75).id).toBe('a')
    expect(pickByWeight(two, () => 0.751).id).toBe('b')
  })

  it('默认权重 1 的候选均匀随机', () => {
    const recipes = getCandidateRecipes(['nightmarefuel', 'nightmarefuel', 'nightmarefuel', 'nightmarefuel'])
    expect(recipes.every((r) => r.weight === 1)).toBe(true)
  })
})

describe('calculateRecipe', () => {
  it('返回菜谱并带烹饪时长', () => {
    const rng = vi.fn<() => number>(() => 0)
    const result = calculateRecipe(
      ['nightmarefuel', 'nightmarefuel', 'nightmarefuel', 'nightmarefuel'],
      'cookpot',
      rng,
    )
    expect(result?.id).toBe('wetgoop')
    expect(result?.cooktime).toBe(0.25)
  })

  it('随机源被调用一次(与游戏流程一致)', () => {
    const rng = vi.fn<() => number>(() => 0.1)
    calculateRecipe(['meat', 'berries', 'berries', 'berries'], 'cookpot', rng)
    expect(rng).toHaveBeenCalledTimes(1)
  })
})
