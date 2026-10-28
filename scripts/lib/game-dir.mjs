// 定位本机 DST 安装目录:Steam 注册表 -> libraryfolders.vdf -> common 目录
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const GAME_DIR_NAME = "Don't Starve Together"

function findSteamDir() {
  for (const cmd of [
    'reg query "HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam" /v InstallPath',
    'reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath',
  ]) {
    try {
      const out = execSync(cmd, { encoding: 'utf8' })
      const m = out.match(/REG_SZ\s+(.+)/)
      if (m) return m[1].trim().replace(/\//g, '\\')
    } catch {
      // 换下一个来源
    }
  }
  return null
}

function findLibraryDirs(steamDir) {
  const vdfPath = path.join(steamDir, 'steamapps', 'libraryfolders.vdf')
  if (!fs.existsSync(vdfPath)) return [steamDir]
  const text = fs.readFileSync(vdfPath, 'utf8')
  const dirs = [...text.matchAll(/"path"\s+"([^"]+)"/g)].map((m) => m[1].replace(/\\\\/g, '\\'))
  return [...new Set([steamDir, ...dirs])]
}

export function findGameDir(explicit) {
  if (explicit) return explicit
  const steamDir = findSteamDir()
  if (!steamDir) throw new Error('未找到 Steam，请用 --dst 指定 DST 安装目录')
  for (const lib of findLibraryDirs(steamDir)) {
    const candidate = path.join(lib, 'steamapps', 'common', GAME_DIR_NAME)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(`Steam 游戏库中未找到 ${GAME_DIR_NAME}，请用 --dst 指定安装目录`)
}
