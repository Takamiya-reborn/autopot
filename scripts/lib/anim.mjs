// Klei ANIM v4 解析:动画记录以 ff 9e 61 1c 分隔标记定位,名字倒查长度前缀
// 元素记录 40 字节:符号哈希 u32 + 帧号 u32 + 层哈希 u32 + 矩阵 4f + 平移 2f + z f
// 返回 Map<动画名, 元素数组>;矩阵已转成 CSS matrix(a,b,c,d) 顺序
export function parseAnims(buf) {
  const u32 = (o) => buf.readUInt32LE(o)
  const f32 = (o) => buf.readFloatLE(o)
  const MARK = Buffer.from([0xff, 0x9e, 0x61, 0x1c])
  const anims = new Map()
  let i = 0
  while ((i = buf.indexOf(MARK, i)) !== -1) {
    const mark = i
    i += 4
    let name = null
    for (let back = 4; back <= 40 && mark - back - 4 >= 0; back++) {
      if (u32(mark - back - 4) !== back) continue
      const s = buf.toString('utf8', mark - back, mark)
      if (/^[\x20-\x7e]+$/.test(s)) { name = s; break }
    }
    if (!name) continue
    const count = u32(mark + 33)
    if (count > 64) continue
    const elements = []
    for (let e = 0; e < count; e++) {
      const q = mark + 37 + e * 40
      if (q + 40 > buf.length) break
      const el = {
        hash: u32(q),
        frame: u32(q + 4),
        // 矩阵为 row-vector 约定(x'=m11*x+m21*y);转 CSS matrix(a,b,c,d) 取转置:b=m12, c=m21
        a: f32(q + 12),
        b: f32(q + 16),
        c: f32(q + 20),
        d: f32(q + 24),
        tx: f32(q + 28),
        ty: f32(q + 32),
        z: f32(q + 36),
      }
      const vals = [el.a, el.b, el.c, el.d, el.tx, el.ty, el.z]
      if (!vals.every((v) => Number.isFinite(v) && Math.abs(v) < 5000)) break
      elements.push(el)
    }
    if (elements.length === count) anims.set(name, elements)
  }
  return anims
}
