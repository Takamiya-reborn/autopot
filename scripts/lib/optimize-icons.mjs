// 图标压缩:缩到 MAX 内 + 调色板 PNG
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// 菜品展示 248px,取 256 覆盖 2x 屏
const MAX = 256

export async function compressIcons(dir) {
  let before = 0
  let after = 0
  let n = 0
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.png')) continue
    const p = path.join(dir, file)
    const buf = await sharp(p)
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .png({ palette: true, quality: 80, compressionLevel: 9 })
      .toBuffer()
    before += fs.statSync(p).size
    after += buf.length
    fs.writeFileSync(p, buf)
    n++
  }
  console.log(`图标压缩 ${n} 张: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`)
}
