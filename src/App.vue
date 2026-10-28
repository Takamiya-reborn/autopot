<script setup lang="ts">
/* 营地夜景:星光 + 暗角,背景由 dst.css 的径向渐变打底;开局遮罩等首屏贴图与字体就绪 */
import { onMounted, ref } from 'vue'
import meatballsImg from '@/assets/icons/meatballs.png'

const show = ref(true)

// 最短展示 900ms,再等 window load(首屏贴图)与字体就绪后揭幕
onMounted(async () => {
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  await Promise.all([new Promise((r) => setTimeout(r, 900)), loaded, document.fonts.ready])
  show.value = false
})
</script>

<template>
  <router-view />

  <Transition name="loader">
    <div v-if="show" class="loader">
      <div class="loader__fire">
        <div class="loader__glow"></div>
        <img class="loader__pot" :src="meatballsImg" alt="" aria-hidden="true" />
      </div>
      <div class="loader__title">DON'T STARVE TOGETHER</div>
      <div class="loader__tip">正在生火…</div>
    </div>
  </Transition>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: radial-gradient(ellipse 120% 90% at 50% 30%, var(--dst-bg) 0%, var(--dst-bg-deep) 100%);
}

.loader__fire {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* 火光:锅底一团脉动的暖光 */
.loader__glow {
  position: absolute;
  bottom: 6px;
  width: 140px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 60%, var(--dst-glow) 0%, transparent 70%);
  animation: loader-pulse 1.1s ease-in-out infinite;
}

.loader__pot {
  position: relative;
  width: 130px;
  animation: loader-bob 1.1s ease-in-out infinite;
}

.loader__title {
  font-size: 22px;
  letter-spacing: 6px;
  color: var(--dst-text);
  text-shadow: 0 0 18px var(--dst-glow), 0 2px 3px #000;
}

.loader__tip {
  font-size: 15px;
  letter-spacing: 4px;
  color: var(--dst-text-dim);
  animation: loader-blink 1.4s ease-in-out infinite;
}

/* 揭幕淡出 */
.loader-leave-active {
  transition: opacity 0.5s ease;
}

.loader-leave-to {
  opacity: 0;
}

@keyframes loader-bob {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes loader-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

@keyframes loader-blink {

  0%,
  100% {
    opacity: 0.45;
  }

  50% {
    opacity: 1;
  }
}
</style>
