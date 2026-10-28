// 生成 src/assets/fonts/ 的西文 @font-face 与 --font-game 字体栈
// 用法: node scripts/build-fonts.mjs
// 字体来源:
//   中文  站酷快乐体 @fontsource/zcool-kuaile (npm 依赖, OFL 1.1, main.ts 直接 import)
//   西文  konstanting.ttf — 饥荒官方简体汉化包 (放 .cache/fonts/)
// konstanting 缺失时自动回退: @fontsource/stint-ultra-condensed(游戏内数字字体);中文始终回退系统字体
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const FONT_CACHE = path.join(projectRoot, '.cache', 'fonts')
const OUT_DIR = path.join(projectRoot, 'src', 'assets', 'fonts')
const STINT = path.join(projectRoot, 'node_modules', '@fontsource', 'stint-ultra-condensed', 'files')
const ZCOOL = path.join(projectRoot, 'node_modules', '@fontsource', 'zcool-kuaile', 'chinese-simplified.css')

const find = (names) => {
  for (const n of names) {
    const p = path.join(FONT_CACHE, n)
    if (fs.existsSync(p)) return p
  }
  return null
}

// 西文:优先 konstanting,回退 stint(仅拉丁+数字,整包即可)
async function buildLatin() {
  const konstanting = find(['konstanting.ttf', 'Konstanting.ttf'])
  if (konstanting) {
    fs.copyFileSync(konstanting, path.join(OUT_DIR, 'konstanting.ttf'))
    console.log('Konstanting 已就位')
    return {
      family: 'Konstanting',
      src: "url('./konstanting.ttf') format('truetype')",
    }
  }
  const woff2 = 'stint-ultra-condensed-latin-400-normal.woff2'
  if (fs.existsSync(path.join(STINT, woff2))) {
    fs.copyFileSync(path.join(STINT, woff2), path.join(OUT_DIR, woff2))
    console.log('Konstanting 缺失,回退 Stint Ultra Condensed(游戏内数字字体)')
    return {
      family: 'Stint Ultra Condensed',
      src: "url('./stint-ultra-condensed-latin-400-normal.woff2') format('woff2')",
      weight: '400',
    }
  }
  console.warn('西文字体缺失(既无 konstanting.ttf 也无 stint),西文将用系统字体')
  return null
}

async function main() {
  fs.mkdirSync(FONT_CACHE, { recursive: true })
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const latin = await buildLatin()
  const zcool = fs.existsSync(ZCOOL)
  let chineseNote = ''
  if (zcool) {
    console.log('站酷快乐体来自 @fontsource/zcool-kuaile,由 main.ts 直接引入,无需生成')
  } else {
    chineseNote = '站酷快乐体缺失:请运行 npm install 安装 @fontsource/zcool-kuaile;当前中文回退系统字体'
    console.warn(chineseNote)
  }

  const lines = [
    '/* 由 scripts/build-fonts.mjs 自动生成,请勿手动编辑 */',
    latin
      ? `@font-face {\n  font-family: '${latin.family}';\n  src: ${latin.src};\n${latin.weight ? `  font-weight: ${latin.weight};\n` : ''}  font-display: swap;\n}\n`
      : '',
  ]
  fs.writeFileSync(path.join(OUT_DIR, 'fonts.css'), lines.filter(Boolean).join('\n'))

  // 生成接入层:西文字体在前(覆盖拉丁与数字),站酷快乐体承接中文
  const stack = [latin?.family, zcool ? 'ZCOOL KuaiLe' : null].filter(Boolean)
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.css'),
    `/* 字体栈:西文/数字用 ${stack[0]},中文用站酷快乐体 */\n:root {\n  --font-game: ${stack
      .map((s) => `'${s}'`)
      .join(', ')}, 'Microsoft YaHei', sans-serif;\n}\n`,
  )
  console.log(`字体栈: --font-game = ${stack.join(', ')}, fallback`)
}

main().catch((e) => {
  console.error(`[build-fonts] ${e.message}`)
  process.exit(1)
})
