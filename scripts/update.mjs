// 游戏更新后的一键对齐:数据 + 图鉴 + 锅体贴图 + public 副本 + 本地构建验证
// 用法: npm run update [-- --dst <DST 安装目录>] [--no-build]
// 结束后自行 git diff 确认、commit 并 push(push main 即触发 Pages 部署)
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findGameDir } from './lib/game-dir.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')

const args = process.argv.slice(2)
const dstFlag = args.includes('--dst') ? args[args.indexOf('--dst') + 1] : null
const noBuild = args.includes('--no-build')

// 游戏目录只定位一次,显式传给各子脚本
const dstPath = dstFlag ? path.resolve(dstFlag) : findGameDir()
console.log(`DST 安装目录: ${dstPath}`)

// 顺序执行提取脚本;子进程失败即中止
for (const script of ['build-data.mjs', 'extract-icons.mjs', 'extract-pot.mjs']) {
  console.log(`\n==> ${script}`)
  const r = spawnSync(process.execPath, [path.join(scriptDir, script), '--dst', dstPath], {
    stdio: 'inherit',
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

// 图鉴里的丸子同时是首屏遮罩用图,内容变化才覆写 public 副本
const iconMeatballs = path.join(projectRoot, 'src', 'assets', 'icons', 'meatballs.png')
const pubMeatballs = path.join(projectRoot, 'public', 'meatballs.png')
if (fs.existsSync(iconMeatballs) && !fs.readFileSync(iconMeatballs).equals(fs.readFileSync(pubMeatballs))) {
  fs.copyFileSync(iconMeatballs, pubMeatballs)
  console.log('\n==> 已同步 public/meatballs.png')
}

if (!noBuild) {
  console.log('\n==> npm run build(类型检查 + 构建验证)')
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true })
}

// 变更摘要
console.log('\n==> 本次变更:')
const status = execFileSync('git', ['status', '--short'], { encoding: 'utf8' }).trim()
console.log(status || '(无变化,无需提交)')
if (status) console.log('\n确认无误后自行 commit 并 push 即可发布。')
