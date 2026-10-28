// 烹饪锅状态:槽位、烹饪流程
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PotRecipe } from '@/data/recipes'
import { INGREDIENTS, type Ingredient } from '@/data/ingredients'
import { calculateRecipe, getCandidateRecipes, getMatchingRecipes } from '@/lib/pot'

const SLOT_COUNT = 4
// 烹饪动画时长(毫秒)
const COOKING_MS = 1600

// mulberry32:小型可复现随机数
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ingredientById = new Map(INGREDIENTS.map((i) => [i.id, i]))

export const usePotStore = defineStore('pot', () => {
  const slots = ref<(string | null)[]>(Array(SLOT_COUNT).fill(null))
  // idle 待投入 / cooking 烹饪动画中 / done 已出结果
  const phase = ref<'idle' | 'cooking' | 'done'>('idle')
  const result = ref<PotRecipe | null>(null)
  // 本次烹饪消耗的食材(下锅即从槽位清空,完成后换一份时复用)
  const cookedIds = ref<string[]>([])
  let cookTimer: ReturnType<typeof setTimeout> | null = null

  const filledIds = computed(() => slots.value.filter((s): s is string => s !== null))
  // 有效食材:未开煮取槽位,开煮后槽位已清空,取入锅记录
  const activeIds = computed(() => {
    const filled = filledIds.value
    return filled.length ? filled : cookedIds.value
  })
  // 候选:放食材/烹饪中展示全部匹配菜谱(后续投料都可能改变结果);出锅后仅同优先级一档(与游戏结果一致)
  const candidates = computed(() => {
    if (!activeIds.value.length) return []
    return phase.value === 'done'
      ? getCandidateRecipes(activeIds.value)
      : getMatchingRecipes(activeIds.value)
  })
  // 同游戏:4 格放满才能开煮
  const canCook = computed(() => filledIds.value.length === SLOT_COUNT && phase.value !== 'cooking')

  // 投放/取出都会打断已出的结果
  function put(slotIndex: number, id: string) {
    if (phase.value === 'cooking') return
    slots.value[slotIndex] = id
    reset()
  }

  function take(slotIndex: number) {
    if (phase.value === 'cooking') return
    slots.value[slotIndex] = null
    reset()
  }

  function reset() {
    if (cookTimer) clearTimeout(cookTimer)
    cookTimer = null
    phase.value = 'idle'
    result.value = null
    cookedIds.value = []
  }

  function cook() {
    if (phase.value === 'cooking') return
    // 新开一锅需 4 格放满;完成后换一份复用上次消耗的食材
    const ids = filledIds.value.length === SLOT_COUNT ? [...filledIds.value] : [...cookedIds.value]
    if (ids.length !== SLOT_COUNT) return
    // 同游戏:食材下锅即消耗,清空槽位
    cookedIds.value = ids
    slots.value.fill(null)
    // 无匹配菜谱时 wetgoop(恒真 test + 最低优先级)自然兜底
    result.value = calculateRecipe(ids, 'cookpot', mulberry32((Math.random() * 0xffffffff) >>> 0))
    phase.value = 'cooking'
    cookTimer = setTimeout(() => {
      phase.value = 'done'
      cookTimer = null
    }, COOKING_MS)
  }

  function slotIngredient(slotIndex: number): Ingredient | null {
    const id = slots.value[slotIndex]
    return id ? (ingredientById.get(id) ?? null) : null
  }

  return {
    slots,
    phase,
    result,
    filledIds,
    activeIds,
    candidates,
    canCook,
    put,
    take,
    reset,
    cook,
    slotIngredient,
  }
})
