// 图标 URL 索引:构建期把 src/assets/icons 全量导入为 URL,按 prefab id 索引;缺图返回 null
const modules = import.meta.glob<string>('../assets/icons/*.png', {
  eager: true,
  import: 'default',
})

export const iconMap: Record<string, string> = {}
for (const [path, url] of Object.entries(modules)) {
  iconMap[path.replace(/^.*\/(.+)\.png$/, '$1')] = url
}

let warmed = false

// 空闲期预热全部图标:可视区已由 <img> 拉取,这里补齐滚动区外与料理成品图,后续渲染零等待
export function prefetchIcons() {
  if (warmed) return
  warmed = true
  // 省流量模式不预热,按需加载
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return

  const warm = () => {
    for (const url of Object.values(iconMap)) {
      const img = new Image()
      img.src = url
    }
  }
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 })
  else setTimeout(warm, 1200)
}
