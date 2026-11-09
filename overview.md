# CREATIVE ARCHIVE — 视觉重制记录（v2 / PRISM HALL）

> 2026-11-09：按最新要求「要有数字艺术感、整体画面更华丽、作品集当前为空（详情页也可以什么都没有）」对站点做一次完整重制。
> 本次不是修补，而是重写：视觉系统、主视觉引擎、五个页面、空状态语言、数据层全部重做。

## 一、艺术方向：PRISM HALL / 棱镜之厅

一座由光构成的展厅，而不是一个「科技风网页」。

- **空间分层**：光场（空气）→ 极光帷幕 → 体积光柱 → 地面光潮（地平线亮丝、透视网格、椭圆 bloom）→ 悬浮水晶碑 → 粉尘 → 每 16s 一次的宽光扫。
- **材质语言**：金色的印刷细线（gilt hairline）、双线画框 + 四角定位标记、mono 大写展签、编号（PLATE 001 / VOL. 01 — MMXXVI）。
- **构成**：左侧大字标题，右侧展签（作品名 / 编号 / 引文），右下 caption rail（SYSTEM / STATE），左下刻度式滚动提示。
- **禁用的东西**：代码雨、HUD 边框、旋转的科技球体、蓝紫渐变模板、无意义粒子。

## 二、技术选择

| 决策 | 选择 | 理由 |
|---|---|---|
| 主视觉引擎 | Canvas 2D + 预渲染 sprite | 用模糊极光 sprite + 叠加混合即可达到目标，成本远低于 WebGL，且无回退负担 |
| 水晶碑 | 解析几何 + 逐面法线打光 | 拉伸八面体的 8 个面按固定 key light 计算亮度，按深度排序绘制，双层描边（柔光 halo + 亮丝） |
| 静态展板 | SVG（确定性 seed） | 同一套视觉系统可以零成本铺满所有未布展状态 |
| 3D 库 | 不引入 Three.js | 目标用 2D 达成，避免 600KB 依赖与 WebGL 回退分支 |

## 三、重写清单

| 文件 | 状态 | 说明 |
|---|---|---|
| `src/styles/global.css` | 重写 | @theme tokens、编辑式排版体系、CJK 规整、画框/发丝线/展签工具类、按钮、grain、cursor、reduced-motion |
| `src/generative/PrismHall.tsx` | 新建 | 六层生成艺术引擎，含指针视差 / 指针透镜 / 视口相对淡出 / 离屏暂停 / reduced-motion 单帧 / 移动端降级 |
| `src/sections/Hero.tsx` | 重写 | 遮罩三叠、分段上升标题、foil 金属渐变强调词、双按钮、右侧展签、caption rail、刻度式滚动提示 |
| `src/pages/Home.tsx` | 重写 | 首屏 + 01 精选作品（空展板）+ 02 关于（monogram 版）+ 03 实验（空台账）+ 04 联系（quiet 版主视觉） |
| `src/pages/Works.tsx` | 重写 | letterhead + 真实分类筛选 + 不规则展览网格（有数据时）+ 展览级空状态 + 分类索引（0 件计数可点筛选） |
| `src/pages/ProjectDetail.tsx` | 重写 | `EmptyPlate`（未收录 slug 的空展板页）+ 通用详情模板（仅在有数据时渲染章节） |
| `src/pages/About.tsx` | 重写 | 编辑式排版 + 排版展板（ghost 001 / "Portrait — not a photograph"）+ 四个 Row 分区 + 「不编造」声明 |
| `src/pages/Lab.tsx` | 重写 | 台账式（有数据为真实行 / 无数据为 6 行空纸 + 状态图例）+ 右侧竖版展板 |
| `src/pages/NotFound.tsx` | 重写 | 404 描边巨数字 + 空展板（"档案中缺失"） |
| `src/components/Nav.tsx` | 重写 | monogram 方框 + 全大写 mono 链接 + 语言切换 + "OPEN FOR 2027" + 移动端全屏菜单 |
| `src/components/Footer.tsx` | 重写 | tagline / NAVIGATE / CONTACT 三栏 + 巨型 engrave 站名 |
| `src/components/PlateFrame.tsx` | 新建 | 画框 + 四角 + figcaption |
| `src/components/ProjectCover.tsx` | 新建 | 确定性 SVG 展板；`bare` 变体为空画框 |
| `src/components/ProjectCard.tsx` | 重写 | 画框 + 状态徽章 + PLATE 编号 + hover 渐层 |
| `src/components/SectionLabel.tsx` / `StatusBadge.tsx` | 改 | gilt 序号 / 状态分色圆点 |
| `src/data/translations.ts` | 重写 | en 完整字典 + zh 同结构字典 + `statusLabel()` |
| `src/data/projects.ts` / `labExperiments.ts` | 清空 | `[]` + 长注释说明「空是有意的」+ 添加模板 |
| `src/lib/text.ts` | 新建 | `splitHeading()`：按中英文标点断行，解决 CJK 大标题「一词跨行」 |

## 四、空状态即展览语言

用户要求「作品为空、点进去也可以什么都没有」，因此「空」被设计成布展中的展厅，而不是失败页：

1. **首页墙面**：16:9 空展板（透视空画框 + 挂钉刻线 + 地面网格 + 极光 + 粉尘），叠 "The wall is ready." / "这件墙还没有作品"。
2. **Works**：左空展板 + 右侧展签说明 + 下方「Index of categories / Acquisition register」——五行分类、右侧 `0 works` 计数、可点击筛选，筛到空分类给出该展间的空状态。
3. **/works/:slug 未命中**：不是通用 404，而是 `EmptyPlate`——显示访问的路径、空画框、"This piece hasn't been hung yet"、返回展间平面图。
4. **Lab**：6 行带横线的空白台账 + 状态图例（IDEA / EXPERIMENT / PROTOTYPE / IN PROGRESS / COMPLETED）。
5. **真正的 404**：描边巨型 404 + "This world doesn't exist yet" + 空展板。

新增真实数据后，各页会自动从空状态切回完整版式，无需改页面代码。

## 五、修复的实质问题（均来自实拍复核）

| 问题 | 修复 |
|---|---|
| 主视觉随 `window.scrollY` 淡出，导致页面下方复用的联系区实例全黑 | 改为按 canvas 自身 `getBoundingClientRect()` 的可见度计算 fade，并用 `camT` 驱动 zoom / horizon / 粒子位移 |
| 首版过紫过亮，像渐变模板 | 光场 alpha 0.5→0.14、光柱 0.055→0.04、地平线亮丝 0.5→0.3，加左重右轻的可读性 scrim |
| 水晶碑过大、压住主标题与展签 | baseScale `min*0.155`→`0.138`、cx `0.7`→`0.655`；展签移到右侧栏顶部 |
| 联系区（居中排版）与主视觉打架 | 新增 `intensity="quiet"`：曝光 0.5、碑位低且偏右、不画回声水晶 |
| 滚动提示与 caption rail 重叠 | 滚动提示移到左下 |
| 中文标题「一词跨行」 | `splitHeading()` 按标点断行渲染 |
| Footer 联系栏掉到第一列 | 改为 `col-start-8` / `col-start-10` 三栏对齐 |
| Works 计数显示 `0 / 0 works` | 改为 `0 works` |

## 六、验收结果（实测，非声明）

| 检查项 | 方法 | 结果 |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ 0 error |
| 生产构建 | `npx vite build` | ✅ 成功 |
| 页面渲染 | dev server + 浏览器逐页实拍 `/`、`/works`、`/about`、`/lab`、`/works/<slug>`、`/nope` | ✅ 全部正常 |
| 中英切换 | 点击 EN / 中文，逐区检查 nav / hero / 各 section / footer / caption rail | ✅ 文案整体替换，路径不变 |
| 路由回退 | `vercel.json` rewrite 全部路径 → `index.html` | ✅ 已配置 |
| 空状态分支 | 清空数据后逐页实拍 | ✅ 首页 / Works / Lab / 详情 / 404 均为设计过的空状态 |
| 动画清理 | 卸载时取消 rAF、移除监听与 IntersectionObserver | ✅ 代码已处理 |

未验证：移动端视口实拍（当前自动化环境无法切换浏览器视口），响应式仅经代码层面确认。

## 七、启动

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite → dist/
npm run preview
```
