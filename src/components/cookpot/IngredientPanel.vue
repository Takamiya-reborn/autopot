<script setup lang="ts">
// 食材选择面板:分类 tab + 搜索 + 图标网格,点击投入锅的第一个空槽
import { computed, ref } from 'vue'
import { INGREDIENTS, type Ingredient, type IngredientCategory } from '@/data/ingredients'
import IngIcon from './IngIcon.vue'
import slotBg from '@/assets/pot/slot.png'

const emit = defineEmits<{ select: [ingredient: Ingredient] }>()

const TABS: { key: IngredientCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'meat', label: '肉类' },
  { key: 'fish', label: '鱼类' },
  { key: 'egg', label: '蛋类' },
  { key: 'veggie', label: '蔬菜' },
  { key: 'fruit', label: '水果' },
  { key: 'dairy', label: '奶类' },
  { key: 'sweetener', label: '甜味' },
  { key: 'fat', label: '油脂' },
  { key: 'seed', label: '种子' },
  { key: 'magic', label: '魔法' },
  { key: 'inedible', label: '其他' },
]

const tab = ref<IngredientCategory | 'all'>('all')
const keyword = ref('')

const list = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return INGREDIENTS.filter(
    (i) =>
      (tab.value === 'all' || i.category === tab.value) &&
      (!kw || i.name.toLowerCase().includes(kw) || i.nameEn.toLowerCase().includes(kw) || i.id.includes(kw)),
  )
})
</script>

<template>
  <div class="ingpanel">
    <input v-model="keyword" class="ingpanel__search" type="search" placeholder="搜索食材…" />
    <div class="ingpanel__tabs">
      <button v-for="t in TABS" :key="t.key" type="button" class="ingpanel__tab"
        :class="{ 'ingpanel__tab--on': tab === t.key }" @click="tab = t.key">
        {{ t.label }}
      </button>
    </div>
    <div class="ingpanel__grid dst-scroll">
      <button v-for="ing in list" :key="ing.id" type="button" class="ingpanel__cell"
        :title="`${ing.name} · ${ing.nameEn}`" :style="{ backgroundImage: `url(${slotBg})` }"
        @click="emit('select', ing)">
        <IngIcon :id="ing.id" :size="44" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.ingpanel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.ingpanel__search {
  width: 100%;
  padding: 8px 14px;
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--dst-border-dim);
  border-radius: 8px;
  color: var(--dst-text);
  font-size: 14px;
  outline: none;
}

.ingpanel__search:focus {
  border-color: var(--dst-accent);
  box-shadow: 0 0 8px var(--dst-glow);
}

/* 每行固定 6 个,均分宽度 */
.ingpanel__tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

/* 分类 tab:游戏 button_small 贴图,同烹饪按钮,选中态用普通贴图、未选中用置灰贴图 */
.ingpanel__tab {
  padding: 11px 0;
  border: none;
  background: url('@/assets/pot/button-disabled.png') center / 100% 100% no-repeat;
  color: #000;
  font-size: 15px;
  letter-spacing: 2px;
  transition: filter 0.15s, transform 0.1s;
}

.ingpanel__tab:hover {
  filter: brightness(1.15);
}

/* 按下下沉 */
.ingpanel__tab:active {
  filter: brightness(0.9);
  transform: translateY(1px);
}

.ingpanel__tab--on {
  background-image: url('@/assets/pot/button.png');
  filter: none;
}

.ingpanel__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 8px;
  /* 吃掉面板剩余高度,盒子不小于内容,避免内容只溢出几px时出现空滚动条 */
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px;
  align-content: start;
}

/* 同 PotSlot:游戏槽位贴图,方格居中铺满 */
.ingpanel__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  transition: filter 0.15s, transform 0.1s;
}

.ingpanel__cell:hover {
  filter: brightness(1.25);
  transform: scale(1.06);
}

/* 按下下沉,盖过 hover 放大 */
.ingpanel__cell:active {
  filter: brightness(0.9);
  transform: scale(0.96);
}
</style>
