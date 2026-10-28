<script setup lang="ts">
// DST 3x3 容器雕花边框:九宫格拉伸(角等比、边自由),顶/底饰件原位叠加,内容由默认插槽自定义
import ornTop from '@/assets/pot/frame-3x3-orn-top.png'
import ornBottom from '@/assets/pot/frame-3x3-orn-bottom.png'

defineProps<{ title?: string }>()
</script>

<template>
  <section class="dst-container">
    <img class="dst-container__orn dst-container__orn--top" :src="ornTop" alt="" aria-hidden="true" />
    <img class="dst-container__orn dst-container__orn--bottom" :src="ornBottom" alt="" aria-hidden="true" />
    <div class="dst-container__inner">
      <div v-if="title" class="dst-container__title">{{ title }}</div>
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* --frame-scale:角/饰件等比缩放系数;边随容器宽高自由拉伸 */
.dst-container {
  /* 0.55:边框显示约 50px,内容区占比更大;调大会趋近游戏原生比例 */
  --frame-scale: 0.55;
  position: relative;
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-width: calc(90px * var(--frame-scale));
  border-image-source: url('../assets/pot/frame-3x3.png');
  /* 切 90px 保住角部卷纹;--frame-scale 为统一缩放系数,边/角/饰件竖向比例一致才不会错缝 */
  border-image-slice: 90 fill;
  border-image-width: calc(90px * var(--frame-scale));
  border-image-repeat: stretch;
}

/* 饰件贴图 142x80,顶/底贴边框外沿、水平居中(绝对定位相对 padding 盒,故偏移一个边框宽) */
.dst-container__orn {
  position: absolute;
  left: 50%;
  translate: -50% 0;
  width: calc(142px * var(--frame-scale));
  height: calc(80px * var(--frame-scale));
}

.dst-container__orn--top {
  top: calc(-90px * var(--frame-scale));
}

.dst-container__orn--bottom {
  bottom: calc(-90px * var(--frame-scale));
}

.dst-container__inner {
  position: relative;
  flex: 1;
  min-height: 0;
}

/* 面板标题 */
.dst-container__title {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--dst-border-dim);
  text-align: center;
  font-size: 16px;
  letter-spacing: 3px;
  color: var(--dst-accent-soft);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}
</style>
