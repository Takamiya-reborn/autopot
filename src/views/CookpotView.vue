<script setup lang="ts">
/* 料理锅主界面:槽位栏 -> 大锅 -> 成品,全部使用游戏原版贴图与布局 */
import { computed } from 'vue'
import type { Ingredient } from '@/data/ingredients'
import { usePotStore } from '@/stores/pot'
import DstContainer from '@/components/DstContainer.vue'
import PotSlot from '@/components/cookpot/PotSlot.vue'
import IngredientPanel from '@/components/cookpot/IngredientPanel.vue'
import IngIcon from '@/components/cookpot/IngIcon.vue'
import CookResult from '@/components/cookpot/CookResult.vue'
import panelImg from '@/assets/pot/panel.png'
import potEmpty from '@/assets/pot/pot-empty.png'
import potFrontImg from '@/assets/pot/pot-front.png'
import lidImg from '@/assets/pot/lid.png'
import ember0Img from '@/assets/pot/ember0.png'
import ember1Img from '@/assets/pot/ember1.png'
import woodImg from '@/assets/pot/wood.png'
import potLayout from '@/assets/pot/layout.json'

const pot = usePotStore()

// 空锅与烹饪中盖盖,投放食材后开盖,完成后锅内出成品
const lidOn = computed(() => pot.phase === 'cooking' || (pot.phase === 'idle' && !pot.filledIds.length))

// 锅摆放取自游戏 cook_pot 动画变换,平移已烘焙 bbox 角点,直接映射 CSS matrix
const { canvas, layers } = potLayout
const DISH_SIZE = 248
// 整体缩小,更接近游戏内相对体积
const POT_SCALE = 0.7

type PotLayerKey = Exclude<keyof typeof layers, 'dish'>

function layerStyle(key: PotLayerKey) {
  const l = layers[key]
  return {
    left: `${canvas.ox - l.w / 2}px`,
    top: `${canvas.oy - l.h / 2}px`,
    width: `${l.w}px`,
    height: `${l.h}px`,
    transform: `matrix(${l.a},${l.b},${l.c},${l.d},${l.tx},${l.ty})`,
  }
}

// 锅盖晃动要绕自身质心旋转:矩阵平移烘进 left/top,盒中心(rotate 基点)即贴图中心,静止位置不变
function lidStyle() {
  const l = layers.lid
  return {
    left: `${canvas.ox + l.tx - l.w / 2}px`,
    top: `${canvas.oy + l.ty - l.h / 2}px`,
    width: `${l.w}px`,
    height: `${l.h}px`,
    transform: `matrix(${l.a},${l.b},${l.c},${l.d},0,0)`,
  }
}

// 成品立在锅口,下半截藏进前壁后,整体略上移露出更多
const DISH_RAISE = 28
const dishStyle = {
  left: `${canvas.ox + layers.dish.cx - DISH_SIZE / 2}px`,
  top: `${canvas.oy + layers.dish.cy - DISH_SIZE / 2 - DISH_RAISE}px`,
}

// 槽位中心纵坐标:槽距 72,块体贴面板上半部,底部留给按钮(游戏截图实测)
const SLOT_TOP = 86
const SLOT_COUNT = 4

// 左侧面板选材:投入第一个空槽
function onPick(ing: Ingredient) {
  const i = pot.slots.findIndex((s) => s === null)
  if (i !== -1) pot.put(i, ing.id)
}
</script>

<template>
  <div class="cookpot">
    <header class="cookpot__head">
      <h1 class="dst-h1">DON'T STARVE TOGETHER · 料理计算器</h1>
    </header>

    <main class="cookpot__main">
      <!-- 左:选食材(雕花边框同右侧成品,点击投入第一个空槽) -->
      <DstContainer title="选食材" class="cookpot__picker-panel">
        <IngredientPanel @select="onPick" />
      </DstContainer>

      <!-- 中:大锅(游戏 cook_pot 动画原始变换,z 越大越靠后:中腿/炭堆/左右腿/锅体/锅盖) -->
      <div class="cookpot__stage">
        <div class="cookpot__pot" :style="{ width: `${canvas.w * POT_SCALE}px`, height: `${canvas.h * POT_SCALE}px` }">
          <div class="cookpot__canvas"
            :style="{ width: `${canvas.w}px`, height: `${canvas.h}px`, transform: `scale(${POT_SCALE})` }">
            <!-- 后排:腿与炭堆,不随烹饪晃动;炭堆平时 ember0,烹饪中 ember1 -->
            <img class="cookpot__layer" :style="layerStyle('legM')" :src="woodImg" alt="" aria-hidden="true" />
            <img class="cookpot__layer" :style="layerStyle('ember')"
              :src="pot.phase === 'cooking' ? ember1Img : ember0Img" alt="" aria-hidden="true" />
            <img class="cookpot__layer" :style="layerStyle('legL')" :src="woodImg" alt="" aria-hidden="true" />
            <img class="cookpot__layer" :style="layerStyle('legR')" :src="woodImg" alt="" aria-hidden="true" />
            <div class="cookpot__layers">
              <img class="cookpot__layer" :class="{ 'cookpot__layer--shake': pot.phase === 'cooking' }"
                :style="layerStyle('body')" :src="potEmpty" alt="料理锅" />
              <!-- 成品:立在锅口,下半截藏进前壁后 -->
              <template v-if="pot.phase === 'done' && pot.result">
                <IngIcon :id="pot.result.id" :size="DISH_SIZE" class="cookpot__dish" :style="dishStyle" />
                <img class="cookpot__layer" :style="layerStyle('front')" :src="potFrontImg" alt="" aria-hidden="true" />
              </template>
              <img v-if="lidOn" class="cookpot__layer" :class="{ 'cookpot__layer--rattle': pot.phase === 'cooking' }"
                :style="lidStyle()" :src="lidImg" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右:槽位栏(游戏原版底板,无外部包装) + 成品 -->
      <div class="cookpot__right">
        <div class="cookpot__panel">
          <div class="cookpot__panel-bg" :style="{ backgroundImage: `url(${panelImg})` }"></div>
          <PotSlot v-for="i in SLOT_COUNT" :key="i" class="cookpot__slot"
            :style="{ top: `${SLOT_TOP + (i - 1) * 72}px` }" :index="i - 1" :ingredient="pot.slotIngredient(i - 1)"
            :locked="pot.phase === 'cooking'" @take="pot.take" />
          <!-- 游戏内烹饪按钮:贴图 ui.xml button_small,贴第 4 槽下方 -->
          <button type="button" class="cookpot__cookbtn" :disabled="!pot.canCook" @click="pot.cook()">
            烹饪
          </button>
        </div>

        <DstContainer class="cookpot__result-panel">
          <CookResult :result="pot.result" :candidates="pot.candidates" :done="pot.phase === 'done'"
            @reroll="pot.cook" />
        </DstContainer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cookpot {
  max-width: 1720px;
  margin: 0 auto;
  padding: 32px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cookpot__head {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ---------- 主区布局 ---------- */

.cookpot__main {
  display: grid;
  /* 弹性三栏:选食材 1.4fr / 大锅按锅贴图实际宽(约 309px)取 auto / 槽位+成品 1fr */
  grid-template-columns: minmax(340px, 1.4fr) auto minmax(480px, 1fr);
  gap: 18px;
  /* 行高只由右栏(食材槽位)撑起,左右两栏 height:0 + min-height:100% 跟随行高 */
}

/* 左:选食材面板,不参与行高,拉伸到食材栏同高,网格内部滚动 */
.cookpot__picker-panel {
  height: 0;
  min-height: 100%;
}

/* 内容板留白,食材列表自身 flex 撑满并内滚动 */
.cookpot__picker-panel :deep(.dst-container__inner) {
  display: flex;
  flex-direction: column;
  padding: 12px;
}

/* 右:槽位栏定宽撑起整行,成品等高跟随 */
.cookpot__right {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
}

/* 成品容器九宫格拉伸,随槽位栏同高;内容超出时内板内滚动 */
.cookpot__result-panel :deep(.dst-container__inner) {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cookpot__result-panel :deep(.cook-result) {
  flex: 1;
  min-height: 0;
}

/* 游戏 ui_cookpot_1x4 底板:idle 动画纵向压扁 0.9348(452 -> 423),槽位块贴上半部 */
.cookpot__panel {
  position: relative;
  width: 173px;
  height: 423px;
  /* 上下留白撑起行高,避免裸贴图导致整区过矮 */
  margin: 150px auto;
}

.cookpot__panel-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 173px;
  height: 452px;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 173px 452px;
  transform: scaleY(0.9348);
  transform-origin: top center;
}

.cookpot__slot {
  position: absolute;
  left: 50%;
  /* 用独立 translate 居中,避免覆盖槽位自身的 scale 按压动画 */
  translate: -50% -50%;
}

/* 游戏内烹饪按钮:button_small 贴图按原始尺寸 95x47 显示,贴第 4 槽下方,黑字 */
.cookpot__cookbtn {
  position: absolute;
  left: 50%;
  top: 333px;
  transform: translateX(-50%);
  width: 95px;
  height: 47px;
  padding: 0;
  border: none;
  background: url('../assets/pot/button.png') center / 100% 100% no-repeat;
  color: #000;
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: filter 0.15s, transform 0.1s;
}

.cookpot__cookbtn:hover:not(:disabled) {
  background-image: url('../assets/pot/button-hover.png');
  filter: brightness(1.05);
}

/* 按下下沉,保留居中位移 */
.cookpot__cookbtn:active:not(:disabled) {
  transform: translateX(-50%) translateY(2px);
  filter: brightness(0.92);
}

.cookpot__cookbtn:disabled {
  background-image: url('../assets/pot/button-disabled.png');
  cursor: not-allowed;
}

/* ---------- 大锅(游戏贴图合成,变换取自 layout.json) ---------- */

.cookpot__stage {
  height: 0;
  min-height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  /* 左右留白,避免锅贴图贴着相邻面板显得挤 */
  padding: 0 56px 26px;
}

.cookpot__pot {
  position: relative;
  /* 锅盒为固定像素(画布 x 缩放),禁止 flex 收缩导致画布溢出被相邻面板盖住 */
  flex: none;
}

/* 画布原生尺寸,整体 scale 缩放 */
.cookpot__canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}

.cookpot__layer {
  position: absolute;
}

.cookpot__layers {
  position: absolute;
  inset: 0;
}

/* 成品:立在锅口,宽度接近锅口,出锅时弹出 */
.cookpot__dish {
  position: absolute;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 6px rgba(0, 0, 0, 0.6));
  animation: dst-pop 0.25s ease-out;
}

/* ---------- 烹饪动画:平移+旋转晃动,锅盖周期约为锅体一半 ---------- */
/* 动画用独立 translate/rotate 属性,不覆盖 layerStyle 烘焙的 matrix */

.cookpot__layer--shake {
  /* 锅体小幅慢晃 */
  animation: shake-body 0.6s ease-in-out infinite;
}

.cookpot__layer--rattle {
  /* 锅盖大幅快晃,周期约为一半 */
  animation: shake 0.3s ease-in-out infinite;
}

@keyframes shake-body {

  0%,
  100% {
    translate: 0 0;
    rotate: 0deg;
  }

  25% {
    translate: -1px 0.5px;
    rotate: -0.4deg;
  }

  75% {
    translate: 1px -0.5px;
    rotate: 0.4deg;
  }
}

@keyframes shake {

  0%,
  100% {
    translate: 0 0;
    rotate: 0deg;
  }

  25% {
    translate: -3px 2px;
    rotate: -1.5deg;
  }

  75% {
    translate: 3px -2px;
    rotate: 1.5deg;
  }
}

/* ---------- 移动端堆叠 ---------- */

@media (max-width: 760px) {
  .cookpot__main {
    grid-template-columns: 1fr;
  }

  /* 单列堆叠后各行独立,取消等高跟随 */
  .cookpot__picker-panel,
  .cookpot__stage {
    height: auto;
    min-height: 0;
  }

  .cookpot__stage {
    order: -1;
    padding-top: 8px;
  }

  .cookpot__right {
    order: 1;
  }

  .cookpot__picker-panel {
    order: 2;
  }
}
</style>
