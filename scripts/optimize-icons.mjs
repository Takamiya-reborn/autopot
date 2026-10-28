// 重压 src/assets/icons 现有图标(extract-icons 末尾会自动调用;单独运行用于已提取的存量)
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compressIcons } from './lib/optimize-icons.mjs'

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'icons')

compressIcons(OUT_DIR)
