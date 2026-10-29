<script setup lang="ts">
/* 营地夜景:星光 + 暗角,背景由 dst.css 的径向渐变打底;首屏遮罩在 index.html 静态渲染,此处负责揭幕 */
import { onMounted } from 'vue'
import CookpotView from '@/views/CookpotView.vue'
import { prefetchIcons } from '@/lib/icons'

// 最短展示 900ms,再等 window load(首屏贴图)与字体就绪后揭幕
onMounted(async () => {
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  await Promise.all([new Promise((r) => setTimeout(r, 900)), loaded, document.fonts?.ready])

  // 揭幕即预热:首屏贴图已就绪,空闲期后台补齐其余图标
  prefetchIcons()

  const loader = document.getElementById('loader')
  if (!loader) return
  loader.classList.add('boot-loader--leave')
  setTimeout(() => loader.remove(), 550) // 与 0.5s 淡出过渡对齐
})
</script>

<template>
  <CookpotView />
</template>
