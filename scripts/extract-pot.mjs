// 提取料理锅界面贴图,生成 src/assets/pot/*.png 与 layout.json
// 用法: node scripts/extract-pot.mjs [--dst <DST 安装目录>]
// 来源: anim/cook_pot.zip(锅盖/锅体/木腿/煤炭) + images.zip(hud.tex 的食材槽)
// 摆放数据取自 anim.bin 元素变换,网页端按游戏原始 z 序用 CSS matrix 合成
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { findGameDir } from './lib/game-dir.mjs'
import { decodeKtex, parseBuildFramesFull } from './lib/ktex.mjs'
import { parseAnims } from './lib/anim.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const CACHE = path.join(projectRoot, '.cache', 'game', 'pot')
const OUT_DIR = path.join(projectRoot, 'src', 'assets', 'pot')
const TAR = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe')

// cook_pot build 的符号哈希;7caac8a5 为烧焦残骸剪影(RGB 全黑),不用
const SYM = { lid: 0x3597a4a7, body: 0x3795e435, ember: 0xa10d3b1c, leg: 0xd7c2dd6d }

function parseArgs() {
  const args = process.argv.slice(2)
  const i = args.indexOf('--dst')
  return i >= 0 && args[i + 1] ? path.resolve(args[i + 1]) : null
}

// anim zip -> build.bin 帧表 + atlas-0.tex,按符号哈希/帧号取帧矩形;anim.bin 缺省时无动画表
function extractFrames(zipPath, tag) {
  const tmp = path.join(CACHE, tag)
  fs.mkdirSync(tmp, { recursive: true })
  execFileSync(TAR, ['-xf', zipPath, '-C', tmp, 'build.bin', 'atlas-0.tex'], { stdio: 'pipe' })
  let anims = new Map()
  try {
    execFileSync(TAR, ['-xf', zipPath, '-C', tmp, 'anim.bin'], { stdio: 'pipe' })
    anims = parseAnims(fs.readFileSync(path.join(tmp, 'anim.bin')))
  } catch { /* 无动画表 */ }
  const parsed = parseBuildFramesFull(fs.readFileSync(path.join(tmp, 'build.bin')))
  const tex = decodeKtex(fs.readFileSync(path.join(tmp, 'atlas-0.tex')))
  const img = sharp(tex.rgba, { raw: { width: tex.w, height: tex.h, channels: 4 } })
  const frames = parsed.map((f) => ({
    hash: f.hash,
    frameNum: f.frameNum,
    bbox: f.bbox,
    img,
    rect: {
      left: Math.round(f.uv.u1 * tex.w),
      top: Math.round((1 - f.uv.v2) * tex.h),
      width: Math.round((f.uv.u2 - f.uv.u1) * tex.w),
      height: Math.round((f.uv.v2 - f.uv.v1) * tex.h),
    },
  }))
  const pick = (hash, frameNum) => {
    const f = frames.find((r) => r.hash === hash && r.frameNum === frameNum)
    if (!f) throw new Error(`build 中找不到符号 ${hash.toString(16)} 帧 ${frameNum}`)
    if (Math.abs(f.rect.width - f.bbox.w) > 8 || Math.abs(f.rect.height - f.bbox.h) > 8) {
      throw new Error(`符号 ${hash.toString(16)} 帧 ${frameNum} 尺寸异常: ${f.rect.width}x${f.rect.height}, bbox ${f.bbox.w}x${f.bbox.h}`)
    }
    return { img, rect: f.rect, bbox: f.bbox }
  }
  return { frames, pick, anims }
}

// anim 贴图用棋盘抖动 alpha 表现半透明,网页上叠深色底会成噪点;
// 模糊 alpha 成实心掩膜后二值化,露出干净的 RGB(游戏内等价于不透明渲染)
async function solidAlphaMask(alpha, w, h) {
  // threshold 输出为 3 通道,需显式降到单通道
  return sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
    .blur(2.5)
    .threshold(60)
    .toColourspace('b-w')
    .raw()
    .toBuffer()
}

async function saveOpaque(frame, file) {
  const { data, info } = await frame.img.clone().extract(frame.rect).raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const alpha = await solidAlphaMask(data.filter((_, i) => i % 4 === 3), w, h)
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = alpha[i]
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(OUT_DIR, file))
}

async function main() {
  const gameDir = findGameDir(parseArgs())
  console.log(`游戏目录: ${gameDir}`)
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // ---- cook_pot build:盖/体/前壁/腿/炭堆(ember0 平时,ember1 烹饪中) ----
  const { pick, anims } = extractFrames(path.join(gameDir, 'data', 'anim', 'cook_pot.zip'), 'cook_pot')
  const lidFrame = pick(SYM.lid, 0)
  const bodyFrame = pick(SYM.body, 0)
  const frontFrame = pick(SYM.body, 2)
  const ember0Frame = pick(SYM.ember, 0)
  const ember1Frame = pick(SYM.ember, 1)
  const legFrame = pick(SYM.leg, 0)
  await saveOpaque(lidFrame, 'lid.png')
  await saveOpaque(bodyFrame, 'pot-empty.png')
  await saveOpaque(frontFrame, 'pot-front.png')
  await saveOpaque(ember0Frame, 'ember0.png')
  await saveOpaque(ember1Frame, 'ember1.png')
  await saveOpaque(legFrame, 'wood.png')

  // ---- 摆放:cook_pot 动画(盖盖待机)给出 盖/体/三腿/炭堆 变换 ----
  // 三腿同符号:tx 绝对值最小者为中腿(透视压缩 d<1),其余按 tx 正负分左右
  const pose = anims.get('cook_pot')
  if (!pose) throw new Error('anim.bin 中找不到 cook_pot 动画')
  const bySym = (hash) => pose.filter((e) => e.hash === hash)
  const legs = bySym(SYM.leg)
  if (legs.length !== 3) throw new Error(`cook_pot 动画腿数量异常: ${legs.length}`)
  const [legM] = legs.sort((p, q) => Math.abs(p.tx) - Math.abs(q.tx))
  const [legR, legL] = legs.filter((l) => l !== legM).sort((p, q) => q.tx - p.tx)
  const emberEl = bySym(SYM.ember)[0]
  if (!emberEl) throw new Error('cook_pot 动画中找不到炭堆元素')

  // 顶点以 bbox 角点为图像原点:等效平移 = 动画平移 + 矩阵·bbox,网页按图层中心定位时直接可用
  const round4 = (v) => Math.round(v * 10000) / 10000
  const layer = (el, frame, file) => {
    const bx = frame.bbox.x, by = frame.bbox.y
    return {
      img: file,
      w: frame.rect.width,
      h: frame.rect.height,
      a: round4(el.a),
      b: round4(el.b),
      c: round4(el.c),
      d: round4(el.d),
      tx: round4(el.tx + el.a * bx + el.c * by),
      ty: round4(el.ty + el.b * bx + el.d * by),
    }
  }

  const layers = {
    ember: layer(emberEl, ember0Frame, 'ember0.png'),
    lid: layer(bySym(SYM.lid)[0], lidFrame, 'lid.png'),
    body: layer(bySym(SYM.body)[0], bodyFrame, 'pot-empty.png'),
    front: layer(bySym(SYM.body)[0], frontFrame, 'pot-front.png'),
    legR: layer(legR, legFrame, 'wood.png'),
    legL: layer(legL, legFrame, 'wood.png'),
    legM: layer(legM, legFrame, 'wood.png'),
  }
  layers.ember1 = { ...layers.ember, img: 'ember1.png' }

  // 画布 = 全图层变换后角点的并集;成品锚点取锅口中心略上(下半截藏进前壁)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const l of Object.values(layers)) {
    for (const [cx, cy] of [[-l.w / 2, -l.h / 2], [l.w / 2, -l.h / 2], [-l.w / 2, l.h / 2], [l.w / 2, l.h / 2]]) {
      const x = l.a * cx + l.c * cy + l.tx
      const y = l.b * cx + l.d * cy + l.ty
      minX = Math.min(minX, x); minY = Math.min(minY, y)
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y)
    }
  }
  const canvas = { w: Math.ceil(maxX - minX), h: Math.ceil(maxY - minY), ox: Math.ceil(-minX), oy: Math.ceil(-minY) }
  // 成品锚点:锅口中心,略低于锅沿,底部藏进前壁(前壁顶边约在 anim y=-260)
  layers.dish = { cx: 0, cy: -238 }
  fs.writeFileSync(path.join(OUT_DIR, 'layout.json'), JSON.stringify({ canvas, layers }, null, 2))

  // ---- ui_cookpot_1x4:烹饪界面 1x4 槽位栏底板(游戏 containers.lua 引用) ----
  const { frames: uiFrames } = extractFrames(path.join(gameDir, 'data', 'anim', 'ui_cookpot_1x4.zip'), 'ui_cookpot_1x4')
  const panel = uiFrames[0]
  if (!panel) throw new Error('ui_cookpot_1x4 无帧')
  await panel.img.clone().extract(panel.rect).png().toFile(path.join(OUT_DIR, 'panel.png'))

  // ---- ui_chest_3x3:通用容器雕花边框,九宫格化(角等比缩放,边自由拉伸) ----
  // 饰件横跨顶/底边中央,直接九宫格会拉变形:从底图抹平,裁出小图原位叠加
  const { frames: chestFrames } = extractFrames(path.join(gameDir, 'data', 'anim', 'ui_chest_3x3.zip'), 'ui_chest_3x3')
  const chest = chestFrames[0]
  if (!chest) throw new Error('ui_chest_3x3 无帧')
  const { data: chestRaw, info: chestInfo } = await chest.img.clone().extract(chest.rect).raw().toBuffer({ resolveWithObject: true })
  const cw = chestInfo.width, ch = chestInfo.height
  const rawOpts = { raw: { width: cw, height: ch, channels: 4 } }
  // 顶 y 0..90 / 底 y 252..342 的 x 90..257 区域,逐行用 x 92..104 干净条的平均色回填(保留横向轮廓,无木纹噪点)
  const CL = 92, CWID = 12, EX0 = 90, EX1 = 257
  const smoothed = Buffer.from(chestRaw)
  for (const [y0, y1] of [[0, 90], [252, ch]]) {
    for (let y = y0; y < y1; y++) {
      const avg = [0, 0, 0, 0]
      for (let x = CL; x < CL + CWID; x++) for (let i = 0; i < 4; i++) avg[i] += chestRaw[(y * cw + x) * 4 + i]
      for (let i = 0; i < 4; i++) avg[i] = Math.round(avg[i] / CWID)
      for (let x = EX0; x < EX1; x++) smoothed.set(avg, (y * cw + x) * 4)
    }
  }
  await sharp(smoothed, rawOpts).png().toFile(path.join(OUT_DIR, 'frame-3x3.png'))
  // 饰件小图(含脚下木条段),142x80,叠加时顶贴边框外沿、水平居中
  const ORN = { left: 100, width: 142, height: 80 }
  await sharp(chestRaw, rawOpts).extract({ ...ORN, top: 0 }).png().toFile(path.join(OUT_DIR, 'frame-3x3-orn-top.png'))
  await sharp(chestRaw, rawOpts).extract({ ...ORN, top: 262 }).png().toFile(path.join(OUT_DIR, 'frame-3x3-orn-bottom.png'))

  // ---- hud.tex 的 inv_slot(通用空白羊皮纸槽位;cook_slot_food 是熊罐的,不用) ----
  const hudDir = path.join(CACHE, 'hud')
  fs.mkdirSync(hudDir, { recursive: true })
  for (const m of ['images/hud.tex', 'images/hud.xml']) {
    execFileSync(TAR, ['-xf', path.join(gameDir, 'data', 'databundles', 'images.zip'), '-C', hudDir, m], { stdio: 'pipe' })
  }
  const xml = fs.readFileSync(path.join(hudDir, 'images', 'hud.xml'), 'utf8')
  const m = xml.match(/<Element name="inv_slot\.tex"([^/]*)\/>/)
  if (!m) throw new Error('hud.xml 中未找到 inv_slot')
  const a = {}
  for (const attr of m[1].matchAll(/(u1|u2|v1|v2)="([\d.]+)"/g)) a[attr[1]] = Number(attr[2])
  const tex = decodeKtex(fs.readFileSync(path.join(hudDir, 'images', 'hud.tex')))
  const rect = {
    left: Math.round(a.u1 * tex.w),
    top: Math.round((1 - a.v2) * tex.h),
    width: Math.round((a.u2 - a.u1) * tex.w),
    height: Math.round((a.v2 - a.v1) * tex.h),
  }
  // 抖动半透明 alpha 平滑化:非零全保留,整体透明度交给 CSS,避免槽位呈噪点
  const { data, info } = await sharp(tex.rgba, { raw: { width: tex.w, height: tex.h, channels: 4 } })
    .extract(rect)
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 0; i < info.width * info.height; i++) data[i * 4 + 3] = data[i * 4 + 3] > 0 ? 255 : 0
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(path.join(OUT_DIR, 'slot.png'))

  // ---- ui.tex 的 button_small 三态(containerwidget.lua 锅内"烹饪"按钮) ----
  const uiDir = path.join(CACHE, 'ui')
  fs.mkdirSync(uiDir, { recursive: true })
  for (const m of ['images/ui.tex', 'images/ui.xml']) {
    execFileSync(TAR, ['-xf', path.join(gameDir, 'data', 'databundles', 'images.zip'), '-C', uiDir, m], { stdio: 'pipe' })
  }
  const uiTex = decodeKtex(fs.readFileSync(path.join(uiDir, 'images', 'ui.tex')))
  const uiXml = fs.readFileSync(path.join(uiDir, 'images', 'ui.xml'), 'utf8')
  const uiImg = sharp(uiTex.rgba, { raw: { width: uiTex.w, height: uiTex.h, channels: 4 } })
  const buttons = {
    button_small: 'button.png',
    button_small_over: 'button-hover.png',
    button_small_disabled: 'button-disabled.png',
  }
  for (const [name, file] of Object.entries(buttons)) {
    const el = uiXml.match(new RegExp(`<Element name="${name}\\.tex"([^/]*)/>`))
    if (!el) throw new Error(`ui.xml 中未找到 ${name}`)
    const a = {}
    for (const attr of el[1].matchAll(/(u1|u2|v1|v2)="([\d.]+)"/g)) a[attr[1]] = Number(attr[2])
    const rect = {
      left: Math.round(a.u1 * uiTex.w),
      top: Math.round((1 - a.v2) * uiTex.h),
      width: Math.round((a.u2 - a.u1) * uiTex.w),
      height: Math.round((a.v2 - a.v1) * uiTex.h),
    }
    const { data, info } = await uiImg.clone().extract(rect).raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < info.width * info.height; i++) data[i * 4 + 3] = data[i * 4 + 3] > 0 ? 255 : 0
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(path.join(OUT_DIR, file))
  }

  console.log(`完成 -> ${path.relative(projectRoot, OUT_DIR)}`)
}

main().catch((e) => {
  console.error(`[extract-pot] ${e.message}`)
  console.error(e.stack)
  process.exit(1)
})
