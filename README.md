<div align="center">

<img src="public/favicon.png" width="96" alt="autopot">

# **autopot**

**饥荒联机版（Don't Starve Together）料理计算器**

**帮你在下锅前算清楚这锅能出什么**

简体中文 | [English](README.en.md)

![Vue](https://img.shields.io/badge/Vue-42b883?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-f7d336?logo=pinia&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6e9f18?logo=vitest&logoColor=white)

</div>

## 功能

模拟游戏内的烹饪逻辑

## 数据来源

数据解析自**本机游戏本体**的脚本（`data/databundles/scripts.zip`，随游戏更新永远最新）。
`npm run data` 一键完成提取与生成 `src/data/ingredients.ts`、`src/data/recipes.ts`：

```sh
npm run data
```

脚本自动定位 Steam 中的 DST 安装目录并解包（也可用
`node scripts/build-data.mjs --dst "<DST 安装目录>"` 手动指定），然后解析：

- `cooking.lua` —— 材料注册表（各食材的食物值、熟制/干制变体）
- `prefabs/oceanfishdef.lua` —— 海洋鱼的入锅食物值
- `languages/chinese_s.po` —— 官方简体中文名

> 游戏更新后重新执行 `npm run data` 即可同步最新食材。

## 素材提取

均从本机游戏本体提取（自动定位 Steam，或用 `--dst` 指定安装目录）：

```sh
npm run extract-icons   # 物品栏图标 -> src/assets/icons/（预放大 + 锐化，压缩到 128px 内）
node scripts/extract-pot.mjs   # 料理锅界面贴图与摆放数据 -> src/assets/pot/
npm run build-fonts     # 生成西文 @font-face 与 --font-game 字体栈 -> src/assets/fonts/
```

已提取的存量图标可单独重压：`node scripts/optimize-icons.mjs`。

## 字体

按 unicode-range 切分自托管（GitHub Pages 友好）：

- **中文**：站酷快乐体（OFL 1.1，npm 依赖 `@fontsource/zcool-kuaile`），经 `npm run build-fonts`
  生成 unicode-range 分片（产物已入库，克隆即可用）；拉丁字面已剔除，英文一律由西文字体渲染
- **西文/数字**：`konstanting.ttf`（官方简体汉化包字体，放入 `.cache/fonts/` 后重跑
  `npm run build-fonts`）；缺失时自动回退 Stint Ultra Condensed（游戏内数字字体，OFL，经 npm 依赖内置）

中文无需手动下载；西文可缺省运行（回退 Stint），放入后重跑即升级。

## 部署

生产构建产物在 `dist/`，`vite.config.ts` 的 `base` 设为 `/autopot/`，适配 GitHub Pages
项目站点（`https://<用户名>.github.io/autopot/`）。

## 版权声明

- 本项目全部代码与内容**仅供学习交流等非商业用途**，严禁将本工具或其构建产物用于
  任何形式的商业牟利。

## 开发

需要 Node.js `^22.18.0 || >=24.12.0`（仓库已含 `mise.toml`，用 mise 的直接 `mise install`）。

```sh
npm install
```

### 本地开发

```sh
npm run dev
```

### 类型检查与生产构建

```sh
npm run build
```

### 单元测试

```sh
npm run test:unit
```

### Lint

```sh
npm run lint
```
