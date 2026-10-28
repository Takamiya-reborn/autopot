// 从本机 DST 提取物品栏图鉴贴图,生成 src/assets/icons/<prefab>.png
// 用法: node scripts/extract-icons.mjs [--dst <DST 安装目录>]
// 流程: images.zip -> inventoryimages*.tex -> 内置解码(KTEX/DXT) -> 按 XML UV 裁剪
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { findGameDir } from './lib/game-dir.mjs'
import { decodeKtex, parseBuildFrames } from './lib/ktex.mjs'
import { compressIcons } from './lib/optimize-icons.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const CACHE = path.join(projectRoot, '.cache', 'game', 'icons')
const OUT_DIR = path.join(projectRoot, 'src', 'assets', 'icons')
const BUNDLE = path.join('data', 'databundles', 'images.zip')
// 图鉴图集;后面的图集覆盖前面同名帧(1-4 依次更新)
const ATLASES = ['inventoryimages1', 'inventoryimages2', 'inventoryimages3', 'inventoryimages4']

function parseArgs() {
  const args = process.argv.slice(2)
  const i = args.indexOf('--dst')
  return i >= 0 && args[i + 1] ? path.resolve(args[i + 1]) : null
}

const TAR = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe')

// 图鉴原生约 64px,导出预放大 + 轻锐化改善观感;落盘前统一压缩到 128px 内
const UPSCALE = 2

// 裁剪 -> lanczos 放大 -> 锐化 -> 落盘(clone 防止复用同一管道时相互污染)
async function saveIcon(img, rect, file) {
  await img
    .clone()
    .extract(rect)
    .resize(rect.width * UPSCALE, rect.height * UPSCALE, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .png()
    .toFile(file)
}

// 解包 images.zip 中指定的成员(bsdtar 支持 zip 且可按成员提取),缺成员跳过
function extractMembers(zipPath, members, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const member of members) {
    try {
      execFileSync(TAR, ['-xf', zipPath, '-C', dest, member], { stdio: 'pipe' })
    } catch {
      console.warn(`跳过(包内不存在): ${member}`)
    }
  }
}

// ---------- 图集帧解析与裁剪 ----------

// HUD 三维徽章:金环(status_meter 帧 1)+ 内芯(各 status_*.zip 固定帧)合成
// 帧序号随游戏版本可能变动,更新后需人工核对
const BADGES = [
  { id: 'stat_hunger', anim: 'status_hunger', frame: 0 },
  { id: 'stat_health', anim: 'status_health', frame: 8 },
  { id: 'stat_sanity', anim: 'status_sanity', frame: 12 },
]
const BADGE_RING = { anim: 'status_meter', frame: 1 }

// XML 里 Element name="xxx.tex" u1 u2 v1 v2(纹理坐标,v 向上)
function parseAtlasXml(xmlPath) {
  const text = fs.readFileSync(xmlPath, 'utf8')
  const frames = new Map()
  for (const m of text.matchAll(/<Element name="([^"]+)"([^/]*)\/>/g)) {
    const a = {}
    for (const attr of m[2].matchAll(/(u1|u2|v1|v2)="([\d.]+)"/g)) a[attr[1]] = Number(attr[2])
    if (a.u2 > a.u1 && a.v2 > a.v1) frames.set(m[1], a)
  }
  return frames
}

// 收集数据里的全部 prefab id(兼容 "id": "x" 与 id: 'x' 两种字面量风格)
function collectDataIds() {
  const ids = new Set()
  for (const file of ['ingredients.ts', 'recipes.ts']) {
    const text = fs.readFileSync(path.join(projectRoot, 'src', 'data', file), 'utf8')
    for (const m of text.matchAll(/\b["']?id["']?\s*:\s*["']([^"']+)["']/g)) ids.add(m[1])
  }
  return ids
}

// anim 包兜底:data/anim/<base>.zip 内 build.bin + atlas-0.tex;生/熟图标常在同一 build 的相邻帧
async function extractFromAnim(id, frameIndex, manifest) {
  const base = id.replace(/_cooked$/, '')
  const animZip = path.join(gameDirArg, 'data', 'anim', `${base}.zip`)
  if (!fs.existsSync(animZip)) return false
  const tmp = path.join(CACHE, 'anim', base)
  fs.mkdirSync(tmp, { recursive: true })
  try {
    execFileSync(TAR, ['-xf', animZip, '-C', tmp, 'build.bin', 'atlas-0.tex'], { stdio: 'pipe' })
  } catch {
    return false
  }
  const texPath = path.join(tmp, 'atlas-0.tex')
  if (!fs.existsSync(texPath)) return false
  const frames = parseBuildFrames(fs.readFileSync(path.join(tmp, 'build.bin')))
  const rect = frames[frameIndex] ?? frames[0]
  if (!rect) return false
  const { w, h, rgba } = decodeKtex(fs.readFileSync(texPath))
  const x = Math.round(rect.u1 * w)
  const y = Math.round((1 - rect.v2) * h)
  const fw = Math.round((rect.u2 - rect.u1) * w)
  const fh = Math.round((rect.v2 - rect.v1) * h)
  if (fw <= 0 || fh <= 0 || x < 0 || y < 0 || x + fw > w || y + fh > h) return false
  await saveIcon(
    sharp(rgba, { raw: { width: w, height: h, channels: 4 } }),
    { left: x, top: y, width: fw, height: fh },
    path.join(OUT_DIR, `${id}.png`),
  )
  manifest[id] = { w: fw * UPSCALE, h: fh * UPSCALE, atlas: 'anim' }
  return true
}

// 从 anim 包提取指定帧为 sharp 图(与 extractFromAnim 同一套解包/解码)
async function animFrame(anim, frameIndex) {
  const animZip = path.join(gameDirArg, 'data', 'anim', `${anim}.zip`)
  if (!fs.existsSync(animZip)) return null
  const tmp = path.join(CACHE, 'anim', anim)
  fs.mkdirSync(tmp, { recursive: true })
  try {
    execFileSync(TAR, ['-xf', animZip, '-C', tmp, 'build.bin', 'atlas-0.tex'], { stdio: 'pipe' })
  } catch {
    return null
  }
  const texPath = path.join(tmp, 'atlas-0.tex')
  if (!fs.existsSync(texPath)) return null
  const frames = parseBuildFrames(fs.readFileSync(path.join(tmp, 'build.bin')))
  const rect = frames[frameIndex] ?? frames[0]
  if (!rect) return null
  const { w, h, rgba } = decodeKtex(fs.readFileSync(texPath))
  const x = Math.round(rect.u1 * w)
  const y = Math.round((1 - rect.v2) * h)
  const fw = Math.round((rect.u2 - rect.u1) * w)
  const fh = Math.round((rect.v2 - rect.v1) * h)
  if (fw <= 0 || fh <= 0 || x < 0 || y < 0 || x + fw > w || y + fh > h) return null
  return {
    buf: await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
      .extract({ left: x, top: y, width: fw, height: fh })
      .png()
      .toBuffer(),
    fw,
    fh,
  }
}

// 合成三维徽章:金环为底,内芯按环宽比例居中缩放
async function composeBadges(manifest) {
  const ring = await animFrame(BADGE_RING.anim, BADGE_RING.frame)
  if (!ring) {
    console.warn('跳过三维徽章:金环帧提取失败')
    return
  }
  for (const b of BADGES) {
    const inner = await animFrame(b.anim, b.frame)
    if (!inner) {
      console.warn(`跳过徽章 ${b.id}:内芯帧提取失败`)
      continue
    }
    const target = Math.round(ring.fw * 0.62)
    const scale = target / Math.max(inner.fw, inner.fh)
    const iw = Math.round(inner.fw * scale)
    const ih = Math.round(inner.fh * scale)
    const buf = await sharp(ring.buf)
      .composite([
        {
          input: await sharp(inner.buf).resize(iw, ih).png().toBuffer(),
          left: Math.round((ring.fw - iw) / 2),
          top: Math.round((ring.fh - ih) / 2),
        },
      ])
      .png()
      .toBuffer()
    await sharp(buf).toFile(path.join(OUT_DIR, `${b.id}.png`))
    manifest[b.id] = { w: ring.fw, h: ring.fh, atlas: 'anim-badge' }
  }
  console.log(`三维徽章合成: ${BADGES.length} 枚`)
}

let gameDirArg = null

async function main() {
  const gameDir = findGameDir(parseArgs())
  gameDirArg = gameDir
  console.log(`游戏目录: ${gameDir}`)

  const members = ATLASES.flatMap((a) => [`images/${a}.tex`, `images/${a}.xml`])
  extractMembers(path.join(gameDir, BUNDLE), members, CACHE)
  console.log(`已解包图集: ${members.length} 个文件`)

  fs.mkdirSync(OUT_DIR, { recursive: true })
  const manifest = {}
  let cropped = 0
  for (const atlas of ATLASES) {
    // tar 保留了 zip 内的 images/ 前缀
    const texPath = path.join(CACHE, 'images', `${atlas}.tex`)
    const xmlPath = path.join(CACHE, 'images', `${atlas}.xml`)
    if (!fs.existsSync(texPath) || !fs.existsSync(xmlPath)) continue
    const frames = parseAtlasXml(xmlPath)
    const { w, h, rgba } = decodeKtex(fs.readFileSync(texPath))
    const img = sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    for (const [name, f] of frames) {
      const prefab = name.replace(/\.tex$/, '')
      const x = Math.round(f.u1 * w)
      const y = Math.round((1 - f.v2) * h) // v 坐标向上,转顶部原点
      const fw = Math.round((f.u2 - f.u1) * w)
      const fh = Math.round((f.v2 - f.v1) * h)
      if (fw <= 0 || fh <= 0 || x < 0 || y < 0 || x + fw > w || y + fh > h) continue
      await saveIcon(
        img,
        { left: x, top: y, width: fw, height: fh },
        path.join(OUT_DIR, `${prefab}.png`),
      )
      manifest[prefab] = { w: fw * UPSCALE, h: fh * UPSCALE, atlas }
      cropped++
    }
    console.log(`${atlas}: ${frames.size} 帧`)
  }

  // 图集里没有的新物品(如 onion/tomato)从 anim 包兜底提取
  const dataIds = [...collectDataIds()]
  const fallback = dataIds.filter((id) => !manifest[id])
  let recovered = 0
  for (const id of fallback) {
    // 生食材占 build 的第一帧,熟制变体取第二帧
    const frameIndex = id.endsWith('_cooked') ? 1 : 0
    if (await extractFromAnim(id, frameIndex, manifest)) recovered++
  }
  if (recovered) console.log(`anim 兜底提取: ${recovered} 张`)

  // HUD 三维徽章(金环+内芯合成),UI 直接引用,不参与数据对照
  await composeBadges(manifest)

  // 只保留数据引用的图标,清掉图集里的其余物品
  const used = new Set([...dataIds, ...BADGES.map((b) => b.id)])
  let pruned = 0
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (!file.endsWith('.png')) continue
    if (!used.has(file.replace(/\.png$/, ''))) {
      fs.rmSync(path.join(OUT_DIR, file))
      pruned++
    }
  }
  const keptManifest = Object.fromEntries(Object.entries(manifest).filter(([k]) => used.has(k)))
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(keptManifest, null, 2))
  console.log(`裁剪完成: ${cropped + recovered} 张,清理无关图标 ${pruned} 张 -> src/assets/icons/`)

  await compressIcons(OUT_DIR)

  // 对照数据 id 报告缺图
  const missing = dataIds.filter((id) => !manifest[id])
  if (missing.length) {
    console.warn(`缺图 ${missing.length} 个(将用分类占位图): ${missing.join(', ')}`)
  } else {
    console.log('数据中的食材与菜品全部有图')
  }
}

main().catch((e) => {
  console.error(`[extract-icons] ${e.message}`)
  process.exit(1)
})
