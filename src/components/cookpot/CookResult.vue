<script setup lang="ts">
// 成品展示:出锅大图标 + 同档候选(权重越低越透明),支持换一份
import { computed } from 'vue'
import type { PotRecipe } from '@/data/recipes'
import IngIcon from './IngIcon.vue'
import StatBadges from './StatBadges.vue'

const props = defineProps<{
  result: PotRecipe | null
  candidates: PotRecipe[]
  done: boolean
}>()

const emit = defineEmits<{ reroll: [] }>()

const maxWeight = computed(() => Math.max(...props.candidates.map((c) => c.weight), 1))

// 候选预览(未出锅):按优先级、权重降序,透明度映射权重(游戏内权重全为 1,等概率随机)
const list = computed(() =>
  [...props.candidates]
    .sort((a, b) => b.priority - a.priority || b.weight - a.weight)
    .map((c) => ({
      ...c,
      alpha: 0.4 + (0.6 * c.weight) / maxWeight.value,
      tip: `${c.name} · 优先级 ${c.priority} · 权重 ${c.weight}`,
    })),
)

// 食物类型(与游戏官方简体汉化一致)
const FOODTYPE_LABELS: Record<string, string> = {
  MEAT: '肉',
  VEGGIE: '素食',
  MONSTER: '怪物',
  ELEMENTAL: '元素',
  GOODIES: '好东西',
  ROUGHAGE: '粗食',
  WOOD: '木质',
}

// 保质期:游戏秒换算天(480 秒/天);空或 0 为不腐坏
const perishLabel = computed(() => {
  const t = props.result?.perishtime
  return t && t > 0 ? `${Math.round((t / 480) * 10) / 10} 天` : '永不腐坏'
})

const foodTypeLabel = computed(() => {
  const t = props.result?.foodtype
  return t ? (FOODTYPE_LABELS[t] ?? t) : '—'
})

// 烹饪时长:游戏内以游戏小时计,倍率展示
const cookTimeLabel = computed(() => {
  const t = props.result?.cooktime ?? 0
  return t ? `×${t}` : ''
})
</script>

<template>
  <div class="cook-result">
    <!-- 已出锅:成品 -->
    <div v-if="done && result" class="cook-result__dish">
      <div class="cook-result__icon">
        <IngIcon :id="result.id" :size="84" />
      </div>
      <div class="cook-result__meta">
        <div class="cook-result__name">{{ result.name }}</div>
        <div class="cook-result__name-en">{{ result.nameEn }}</div>
      </div>
      <StatBadges
        :hunger="result.stats.hunger"
        :health="result.stats.health"
        :sanity="result.stats.sanity"
        :size="60"
      />
      <div class="cook-result__props">
        <span>食物类型 <b>{{ foodTypeLabel }}</b></span>
        <span>保质期 <b>{{ perishLabel }}</b></span>
        <span v-if="cookTimeLabel">烹饪时长 <b>{{ cookTimeLabel }}</b></span>
      </div>
      <button
        v-if="candidates.length > 1"
        type="button"
        class="dst-btn cook-result__reroll"
        @click="emit('reroll')"
      >
        换一份
      </button>
    </div>

    <!-- 未出锅:候选预览 -->
    <template v-else>
      <div v-if="candidates.length" class="cook-result__hint">可能的结果</div>
      <div v-else class="cook-result__hint cook-result__hint--dim">放入食材,开始烹饪</div>

      <ul v-if="list.length" class="cook-result__list">
        <li
          v-for="c in list"
          :key="c.id"
          class="cook-result__item"
          :style="{ opacity: c.alpha }"
          :title="c.tip"
        >
          <IngIcon :id="c.id" :size="40" />
          <div class="cook-result__item-text">
            <span class="cook-result__item-name">{{ c.name }}</span>
            <span class="cook-result__item-weight">{{ c.priority }}</span>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.cook-result__dish {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 6px 0 2px;
}

.cook-result__icon {
  padding: 12px;
  background: radial-gradient(circle at 50% 40%, rgba(232, 134, 44, 0.22), transparent 70%);
  border-radius: 50%;
  filter: drop-shadow(0 0 16px var(--dst-glow));
}

.cook-result__meta {
  text-align: center;
}

.cook-result__name {
  font-size: 26px;
  letter-spacing: 4px;
  color: var(--dst-text);
}

.cook-result__name-en {
  font-size: 17px;
  letter-spacing: 3px;
  color: var(--dst-text-dim);
}

.cook-result__props {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--dst-border-dim);
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--dst-text-dim);
}

.cook-result__props span {
  display: flex;
  justify-content: space-between;
}

/* 右侧值用普通字重:换了字体后加粗显得突兀 */
.cook-result__props b {
  font-weight: 400;
  color: var(--dst-accent-soft);
}

.cook-result__reroll {
  margin-top: 4px;
  padding: 6px 18px;
  font-size: 14px;
}

.cook-result__hint {
  text-align: center;
  font-size: 14px;
  letter-spacing: 3px;
  color: var(--dst-text-dim);
  padding: 8px 0;
  animation: dst-fade-up 0.3s ease-out;
}

.cook-result__hint--dim {
  color: var(--dst-border-dim);
}

.cook-result__list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cook-result__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.cook-result__item-text {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.cook-result__item-name {
  font-size: 17px;
  letter-spacing: 1px;
  font-weight: 400;
}

.cook-result__item-weight {
  min-width: 2.5em;
  text-align: right;
  font-size: 17px;
  color: var(--dst-text-dim);
}
</style>
