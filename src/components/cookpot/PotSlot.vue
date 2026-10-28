<script setup lang="ts">
// 食材槽:游戏通用空白羊皮纸格子(cook_slot_food 是熊罐的);空槽点击打开选择器,已放点击取出
import type { Ingredient } from '@/data/ingredients'
import IngIcon from './IngIcon.vue'
import slotBg from '@/assets/pot/slot.png'

defineProps<{
  index: number
  ingredient: Ingredient | null
  locked: boolean
}>()

const emit = defineEmits<{
  pick: [slotIndex: number]
  take: [slotIndex: number]
}>()
</script>

<template>
  <button
    class="pot-slot"
    :class="{ 'pot-slot--filled': ingredient, 'pot-slot--locked': locked }"
    :title="ingredient ? `${ingredient.name}\n${ingredient.nameEn}` : undefined"
    type="button"
    :disabled="locked"
    :style="{ backgroundImage: `url(${slotBg})` }"
    @click="ingredient ? emit('take', index) : emit('pick', index)"
  >
    <IngIcon v-if="ingredient" :id="ingredient.id" :size="52" />
    <span v-else class="pot-slot__plus">+</span>
  </button>
</template>

<style scoped>
/* 游戏 64px 槽位,贴图 67px 原生边框留白自带 */
.pot-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  padding: 0;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 67px 67px;
  transition: filter 0.15s, transform 0.1s;
}

/* 按下下沉 */
.pot-slot:active:not(:disabled) {
  filter: brightness(0.9);
  transform: translateY(2px);
}

.pot-slot--locked {
  cursor: wait;
  filter: brightness(0.8);
}

.pot-slot__plus {
  font-size: 26px;
  color: rgba(243, 233, 210, 0.4);
  line-height: 1;
}
</style>
