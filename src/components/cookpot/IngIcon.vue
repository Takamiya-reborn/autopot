<script setup lang="ts">
// 物品图标:构建期把 src/assets/icons 全量导入为 URL,按 prefab id 索引;缺图用 ? 占位
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    size?: number
  }>(),
  { size: 48 },
)

const modules = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  import: 'default',
})
const iconMap: Record<string, string> = {}
for (const [path, url] of Object.entries(modules)) {
  iconMap[path.replace(/^.*\/(.+)\.png$/, '$1')] = url
}

const src = computed(() => iconMap[props.id] ?? null)
</script>

<template>
  <img
    v-if="src"
    class="ing-icon"
    :src="src"
    :alt="id"
    :style="{ width: `${size}px`, height: `${size}px` }"
    draggable="false"
  />
  <span
    v-else
    class="ing-icon ing-icon--missing"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.5}px` }"
  >
    ?
  </span>
</template>

<style scoped>
.ing-icon {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5));
}

.ing-icon--missing {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dst-panel-dark);
  border: 1px dashed var(--dst-border-dim);
  border-radius: 6px;
  color: var(--dst-text-dim);
}
</style>
