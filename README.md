# autopot

**饥荒联机版（Don't Starve Together）料理计算器** —— 帮你在下锅前算清楚这锅能出什么。

## 功能

- **模拟烹饪**：任选 1-4 格食材，复刻 `cooking.lua` 的匹配与加权随机逻辑，实时算出这锅能出什么
- **候选预览**：同优先级多结果时按权重列出「可能的结果」，出锅后可换一份
- **失败兜底**：不满足任何配方时按游戏规则给出湿糊浆糊（Wet Goop）
- **食材图鉴**：分类 + 搜索选择器，全部食材的食物值度数

## 技术栈

Vue 3 + TypeScript + Vite + Pinia + Vitest

## 数据来源

数据解析自**本机游戏本体**的脚本（`data/databundles/scripts.zip`，随游戏更新永远最新）。
`npm run data` 一键完成提取与生成 `src/data/ingredients.ts`：

```sh
npm run data
```

脚本自动定位 Steam 中的 DST 安装目录并解包（也可用
`node scripts/build-data.mjs --dst "<DST 安装目录>"` 手动指定），然后解析：

- `cooking.lua` —— 材料注册表（各食材的食物值、熟制/干制变体）
- `prefabs/oceanfishdef.lua` —— 海洋鱼的入锅食物值
- `languages/chinese_s.po` —— 官方简体中文名

> 游戏更新后重新执行 `npm run data` 即可同步最新食材。

### 图标与字体

```sh
npm run extract-icons   # 从本机游戏提取物品栏图标 -> src/assets/icons/
npm run build-fonts     # 生成分片字体与 @font-face -> src/assets/fonts/
```

字体自托管、按 unicode-range 切分（GitHub Pages 友好）：

- **中文**：喵呜体（OFL 1.1，[猫啃网](https://www.maoken.com)）—— 下载 TTF 放到 `.cache/fonts/Miaowu.ttf` 后重跑 `npm run build-fonts`
- **西文/数字**：`konstanting.ttf`（官方简体汉化包字体，放 `.cache/fonts/`）；缺失时自动回退 Stint Ultra Condensed（游戏内数字字体，OFL，经 npm 依赖内置）

两者均可缺省运行（西文回退 Stint，中文回退系统字体），放入后重跑即升级。

## 部署

生产构建产物在 `dist/`，`vite.config.ts` 的 `base` 设为 `/autopot/`，适配 GitHub Pages
项目站点（`https://<用户名>.github.io/autopot/`）。

## 版权声明

本工具从 Don't Starve Together 游戏本体提取的数据与图标素材、以及 Konstanting 字体
均属 **Klei Entertainment** 资产，仅供粉丝制作的非商用工具使用。游戏本体与素材版权归
Klei Entertainment 所有。

## 开发

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
