<script setup lang="ts">
// 图鉴式三维徽章:饥饿/生命/理智 游戏图标 + 数值
import { computed } from 'vue'
import statHunger from '../../assets/icons/stat_hunger.png'
import statHealth from '../../assets/icons/stat_health.png'
import statSanity from '../../assets/icons/stat_sanity.png'

const props = withDefaults(
  defineProps<{
    hunger: number | null
    health: number | null
    sanity: number | null
    size?: number
  }>(),
  { size: 34 },
)

// 最多两位小数;数值字号随图标缩放
const fmt = (v: number | null) => (v == null ? '—' : `${Math.round(v * 100) / 100}`)
const valueFont = computed(() => `${Math.max(12, Math.round(props.size * 0.35))}px`)

const items = computed(() => [
  { icon: statHunger, label: '饥饿', v: props.hunger },
  { icon: statHealth, label: '生命', v: props.health },
  { icon: statSanity, label: '理智', v: props.sanity },
])
</script>

<template>
  <div class="stat-badges">
    <div
      v-for="s in items"
      :key="s.label"
      class="stat-badges__item"
      :title="`${s.label} ${fmt(s.v)}`"
    >
      <img
        :src="s.icon"
        :alt="s.label"
        :style="{ width: `${size}px`, height: `${size}px` }"
        draggable="false"
      />
      <span
        class="stat-badges__value"
        :class="{ 'stat-badges__value--neg': s.v != null && s.v < 0 }"
        :style="{ fontSize: valueFont }"
      >
        {{ fmt(s.v) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.stat-badges {
  display: flex;
  justify-content: center;
  gap: 22px;
}

.stat-badges__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-badges__item img {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
}

.stat-badges__value {
  color: var(--dst-text);
}

.stat-badges__value--neg {
  color: #e06050;
}
</style>
