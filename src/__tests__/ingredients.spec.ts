import { describe, it, expect } from 'vitest'

import { INGREDIENTS, FOOD_TAG_LABELS, CATEGORY_LABELS } from '../data/ingredients'

describe('INGREDIENTS 数据完整性', () => {
  it('数量合理（材料 + 熟制/干制变体）', () => {
    expect(INGREDIENTS.length).toBeGreaterThanOrEqual(90)
  })

  it('id 唯一', () => {
    const ids = INGREDIENTS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每条都有中英文名、分类和食物值', () => {
    for (const ingredient of INGREDIENTS) {
      const id = ingredient.id
      expect(id).toBeTruthy()
      expect(ingredient.name).toBeTruthy()
      expect(ingredient.nameEn).toBeTruthy()
      expect(CATEGORY_LABELS[ingredient.category]).toBeTruthy()
      expect(Object.keys(ingredient.values).length).toBeGreaterThan(0)
      for (const tag of Object.keys(ingredient.values)) {
        expect(FOOD_TAG_LABELS[tag as keyof typeof FOOD_TAG_LABELS]).toBeTruthy()
      }
    }
  })

  it('关键数值与游戏一致', () => {
    const byId = new Map(INGREDIENTS.map((i) => [i.id, i]))
    expect(byId.get('meat')?.values.meat).toBe(1)
    expect(byId.get('tallbirdegg')?.values.egg).toBe(4)
    expect(byId.get('royal_jelly')?.values.sweetener).toBe(3)
    expect(byId.get('durian')?.values.monster).toBe(1)
    expect(byId.get('ice')?.values.frozen).toBe(1)
    expect(byId.get('cookedmeat')?.values.precook).toBe(1)
    expect(byId.get('oceanfish_medium_8_inv')?.values.frozen).toBe(1)
  })
})
