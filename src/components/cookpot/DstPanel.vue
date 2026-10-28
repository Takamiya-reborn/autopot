<script setup lang="ts">
// DST 木质面板,可选装饰标题
defineProps<{ title?: string }>()
</script>

<template>
  <section class="dst-panel">
    <div v-if="title" class="dst-panel__title">{{ title }}</div>
    <slot />
  </section>
</template>
