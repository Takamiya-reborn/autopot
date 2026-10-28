// Klei KTEX 纹理解码(纯 JS,布局参照 ktools/ktech)
// 头部: magic u32 "KTEX" + 位域 u32(platform 4b | compression 5b | type 4b | mipcount 5b | flags 2b | fill 12b)
// mip 预表: 每级 w/h/pitch(u16) + datasz(u32);数据区按 mip 顺序存放
// 压缩类型: 0=DXT1 1=DXT3 2=DXT5 4=RGBA 5=RGB

const COMPRESSION = { 0: 'dxt1', 1: 'dxt3', 2: 'dxt5', 4: 'rgba', 5: 'rgb' }

const rgb565 = (v) => [
  Math.round(((v >> 11) & 0x1f) * 255 / 31),
  Math.round(((v >> 5) & 0x3f) * 255 / 63),
  Math.round((v & 0x1f) * 255 / 31),
]

// DXT 颜色块(8 字节): 两端色 + 2bit 索引;DXT1 且 c0<=c1 时索引 3 为透明
function decodeColorBlock(src, o, out, base, w, isDxt1) {
  const c0 = src.readUInt16LE(o)
  const c1 = src.readUInt16LE(o + 2)
  const [r0, g0, b0] = rgb565(c0)
  const [r1, g1, b1] = rgb565(c1)
  const transparent = isDxt1 && c0 <= c1
  const palette = [
    [r0, g0, b0, 255],
    [r1, g1, b1, 255],
    transparent
      ? [0, 0, 0, 0]
      : [Math.round((2 * r0 + r1) / 3), Math.round((2 * g0 + g1) / 3), Math.round((2 * b0 + b1) / 3), 255],
    transparent
      ? [0, 0, 0, 0]
      : [Math.round((r0 + 2 * r1) / 3), Math.round((g0 + 2 * g1) / 3), Math.round((b0 + 2 * b1) / 3), 255],
  ]
  const bits = src.readUInt32LE(o + 4)
  for (let px = 0; px < 16; px++) {
    const idx = (bits >> (2 * px)) & 3
    const x = base.x + (px % 4)
    const y = base.y + (px >> 2)
    if (x >= w) continue
    const p = (y * w + x) * 4
    out[p] = palette[idx][0]
    out[p + 1] = palette[idx][1]
    out[p + 2] = palette[idx][2]
    // DXT3/5 的 alpha 由独立的 alpha 块写入,这里只在 DXT1 时写
    if (isDxt1) out[p + 3] = palette[idx][3]
  }
}

// DXT5 alpha 块(8 字节): 两端 alpha + 16 个 3bit 索引,8 级插值
function decodeDxt5Alpha(src, o, out, base, w) {
  const a0 = src[o]
  const a1 = src[o + 1]
  const alpha = []
  alpha[0] = a0
  alpha[1] = a1
  if (a0 > a1) {
    for (let i = 0; i < 6; i++) alpha[2 + i] = Math.round(((6 - i) * a0 + (1 + i) * a1) / 7)
  } else {
    for (let i = 0; i < 4; i++) alpha[2 + i] = Math.round(((4 - i) * a0 + (1 + i) * a1) / 5)
    alpha[6] = 0
    alpha[7] = 255
  }
  // 48bit 索引从 o+2 字节起 LSB 在前,不再右移(右移会混入颜色块字节,alpha 错位出噪点)
  const bits = src.readBigUInt64LE(o + 2)
  for (let px = 0; px < 16; px++) {
    const idx = Number((bits >> BigInt(3 * px)) & 7n)
    const x = base.x + (px % 4)
    const y = base.y + (px >> 2)
    if (x >= w) continue
    out[(y * w + x) * 4 + 3] = alpha[idx]
  }
}

// DXT3 alpha 块(8 字节): 每像素显式 4bit
function decodeDxt3Alpha(src, o, out, base, w) {
  for (let px = 0; px < 16; px++) {
    const a = (src[o + (px >> 1)] >> ((px % 2) * 4)) & 0xf
    const x = base.x + (px % 4)
    const y = base.y + (px >> 2)
    if (x >= w) continue
    out[(y * w + x) * 4 + 3] = a * 17
  }
}

function decodeMip(compression, w, h, data) {
  const out = Buffer.alloc(w * h * 4)
  if (compression === 'rgba' || compression === 'rgb') {
    const bpp = compression === 'rgba' ? 4 : 3
    for (let i = 0; i < w * h; i++) {
      out[i * 4] = data[i * bpp]
      out[i * 4 + 1] = data[i * bpp + 1]
      out[i * 4 + 2] = data[i * bpp + 2]
      out[i * 4 + 3] = compression === 'rgba' ? data[i * bpp + 3] : 255
    }
    return { w, h, rgba: out }
  }
  // DXT3/5: 8 字节 alpha + 8 字节颜色;DXT1 仅 8 字节颜色
  const blockSize = compression === 'dxt1' ? 8 : 16
  for (let by = 0; by < h; by += 4) {
    for (let bx = 0; bx < w; bx += 4) {
      const base = { x: bx, y: by }
      const blockOff = (by / 4) * (w / 4) * blockSize + (bx / 4) * blockSize
      if (compression === 'dxt5') decodeDxt5Alpha(data, blockOff, out, base, w)
      else if (compression === 'dxt3') decodeDxt3Alpha(data, blockOff, out, base, w)
      decodeColorBlock(data, blockOff + (blockSize - 8), out, base, w, compression === 'dxt1')
    }
  }
  return { w, h, rgba: out }
}

// 解码 KTEX 第一级 mip,返回 { w, h, rgba };Klei 纹理行序自下而上,输出前翻转成常规顶行在上的位图
export function decodeKtex(buf) {
  if (buf.toString('ascii', 0, 4) !== 'KTEX') throw new Error('非 KTEX 文件')
  const u16 = (o) => buf.readUInt16LE(o)
  const u32 = (o) => buf.readUInt32LE(o)
  const hdr = u32(4)
  const compression = (hdr >> 4) & 0x1f
  const mipmapCount = (hdr >> 13) & 0x1f
  if (!COMPRESSION[compression]) throw new Error(`不支持的压缩类型: ${compression}`)
  const mips = []
  let off = 8
  for (let i = 0; i < mipmapCount; i++) {
    mips.push({ w: u16(off), h: u16(off + 2), pitch: u16(off + 4), datasz: u32(off + 6) })
    off += 10
  }
  const mip0 = mips[0]
  if (!mip0) throw new Error('无 mipmap')
  const { w, h, rgba } = decodeMip(COMPRESSION[compression], mip0.w, mip0.h, buf.subarray(off, off + mip0.datasz))
  const flipped = Buffer.alloc(rgba.length)
  const row = w * 4
  for (let y = 0; y < h; y++) rgba.copy(flipped, (h - 1 - y) * row, y * row, (y + 1) * row)
  return { w, h, rgba: flipped }
}

// 解析 BILD build.bin(参照 ktools/krane),返回全部符号帧的 UV 矩形
export function parseBuildFrames(buf) {
  return walkBuildFrames(buf).map((f) => f.uv)
}

// 详细版:附符号哈希/帧号/bbox(bbox 为符号空间摆放,顶点以帧中心为原点)
export function parseBuildFramesFull(buf) {
  return walkBuildFrames(buf)
}

function walkBuildFrames(buf) {
  if (buf.toString('ascii', 0, 4) !== 'BILD') throw new Error('非 BILD 文件')
  const u32 = (o) => buf.readUInt32LE(o)
  const f32 = (o) => buf.readFloatLE(o)
  let off = 8
  const numSymbols = u32(off)
  off += 8 // numframes
  const str = () => {
    const len = u32(off)
    off += 4 + len
    return buf.toString('utf8', off - len, off)
  }
  str() // build name
  const numAtlases = u32(off)
  off += 4
  for (let i = 0; i < numAtlases; i++) str()

  // 收集每符号每帧的帧号与 alphacount,定位顶点流
  const symbols = []
  let p = off
  for (let s = 0; s < numSymbols; s++) {
    const hash = u32(p)
    const numFrames = u32(p + 4)
    p += 8
    const frames = []
    for (let i = 0; i < numFrames; i++) {
      // framenum u32 + duration u32 + bbox 4f + alphaidx u32 + alphacount u32 = 32 字节
      frames.push({ frameNum: u32(p), bbox: [f32(p + 8), f32(p + 12), f32(p + 16), f32(p + 20)], alphacount: u32(p + 28) })
      p += 32
    }
    symbols.push({ hash, frames })
  }
  p += 4 // 全局 alphaverts

  // 逐帧读取顶点,UV 取并集;顶点数 = alphacount,布局 (x,y,z,u,v,w) 浮点
  const results = []
  for (const { hash, frames } of symbols) {
    for (const frame of frames) {
      const uv = readUvRect(buf, p, frame.alphacount)
      if (uv) results.push({ hash, frameNum: frame.frameNum, uv, bbox: { x: frame.bbox[0], y: frame.bbox[1], w: frame.bbox[2], h: frame.bbox[3] } })
      p += frame.alphacount * 24
    }
  }
  return results
}

function readUvRect(buf, start, verts) {
  const f32 = (o) => buf.readFloatLE(o)
  const tryAt = (base, dx, dv) => {
    if (base + verts * 24 > buf.length) return null
    let minU = Infinity
    let maxU = -Infinity
    let minV = Infinity
    let maxV = -Infinity
    for (let t = 0; t < verts; t++) {
      const u = f32(base + t * 24 + dx)
      const v = f32(base + t * 24 + dx + dv)
      if (![u, v].every(Number.isFinite)) return null
      minU = Math.min(minU, u)
      maxU = Math.max(maxU, u)
      minV = Math.min(minV, v)
      maxV = Math.max(maxV, v)
    }
    if (maxU <= minU || maxV <= minV) return null
    return { u1: minU, u2: maxU, v1: minV, v2: maxV }
  }
  const inUnit = (r) => r && r.u1 >= -0.01 && r.u2 <= 1.01 && r.v1 >= -0.01 && r.v2 <= 1.01
  // 标准 krane 布局 (x,y,z,u,v,w),UV 为归一化坐标
  const direct = tryAt(start, 12, 4)
  if (inUnit(direct)) return direct
  // 兜底:逐浮点滑动找落在 [0,1] 的窗口
  for (let d = 0; d < 12; d++) {
    for (const dv of [4, 8]) {
      const r = tryAt(start + d, 12, dv)
      if (inUnit(r)) return r
    }
  }
  return direct
}
