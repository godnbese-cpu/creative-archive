# CREATIVE ARCHIVE

> A SPACE FOR IDEAS, WORLDS & EXPERIMENTS.
> Ideas become worlds. Worlds become experiences.

一个具有机构级视觉品质的个人数字作品集 / 创意档案馆。它不是简历网站，也不是博客，而是一个「持续生长的个人数字空间」，用来存放原创世界观、游戏原型、AI 视觉故事、交互实验与技术原型。

**当前状态：展厅已建成，作品尚未上墙。** 这是一个刻意留空的档案——真实作品完成之前，不用任何虚构内容填充墙面。每个空状态都按「展览布展中」来设计，而不是当作错误页。

---

## 1. 项目介绍

视觉方向是 **PRISM HALL / 棱镜之厅** —— 一座由光构成的展厅：极光帷幕、地面光潮、悬浮水晶碑、空气里的粉尘，以及一层薄薄的金色印刷细线（gilt hairlines）把所有内容框成「展板」。

五个页面：

- **首页 Home** — 全屏生成艺术主视觉 + 叙事式滚动（精选作品 / 关于创作者 / 实验 / 联系）。
- **作品 Works** — 分类索引 + 展览级空状态 + 分类筛选（分类 0 件时给出对应展间的空状态，而非虚构条目）。
- **项目详情 /works/:slug** — 通用模板：未收录的地址落到「空展板」页（画框在、标签在、作品未上墙），而不是通用 404。
- **关于 About** — 编辑式排版：关于我 / 创作理念 / 兴趣 / 技能工具 / 当前聚焦。
- **实验室 Lab** — 档案台账式设计，带状态标记（想法 / 实验 / 原型 / 开发中 / 已完成）。

核心特点：

- **原创生成艺术主视觉（Canvas 2D）**：预渲染的极光帷幕 sprite + 体光束 + 地平线光潮 + 透视地面 + 悬浮水晶碑（法线打光、双层描边）+ 三层景深粉尘。指针视差、指针透镜、滚动镜头后拉，全部带阻尼；`IntersectionObserver` 在离开视口时暂停循环。
- **同一套绘画系统做静态展板**：`ProjectCover` 用 seed 生成确定性的 SVG 展板——默认是「悬浮水晶」，`bare` 模式则是「挂在墙上的空画框」，用于所有未布展状态。
- **中英双语**：默认英文，一键切换中文；文案集中在 `src/data/translations.ts`，项目/实验数据本身也是双语结构，切换不改变当前路径。中文排版单独调校（显式 CJK 字体栈、字距归零、行高重置、关闭 CJK 伪斜体、按标点断行）。
- **不依赖外部服务**：字体通过 Fontsource 打进产物，无 Google Fonts / Analytics / Maps，核心内容零外部 API，可稳定服务中国大陆访问者。
- **真实图片管线**：`Cover` 组件优先真实图片，加载失败自动回退到生成展板，永不出现破图。
- **工程可交付**：`tsc --noEmit` + `vite build` 通过；SPA 路由静态托管回退已配置；`prefers-reduced-motion`、键盘焦点、语义化结构均已处理。

## 2. 设计理念

**先建立视觉语言，再组织内容。**

- **气质**：近黑建筑 + 暖白纸感 + 一束电光蓝 / 紫罗兰 / 极少量荧光绿；金色细线负责「博物馆」这一层——它把作品框成展板，而不是装饰一个科技页面。
- **生成艺术**：主视觉不是背景视频或渐变色块，而是一个真实运行的「厅」：极光在上、光潮在下、水晶碑悬在中间，随指针与滚动改变视点。
- **排版**：Fraunces（编辑感衬线）承担大标题，Inter 承担正文，JetBrains Mono 承担标签、展板编号与状态，构成三级清晰层级；CJK 单独一套字号、字重与断行规则。
- **Design Tokens**：颜色、字体、缓动、金色细线、渐变集中在 `src/styles/global.css` 的 `@theme` / `:root`，改一处全局生效。
- **空状态即设计**：作品为空时，页面呈现「空画框 + 布展中」的展览语言；实验室为空时，呈现带横线的空白台账与状态图例。

## 3. 技术栈

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | React 18 + TypeScript | 严格模式，类型清晰 |
| 构建 | Vite 5 | 快速开发 + 纯静态产物 |
| 样式 | Tailwind CSS v4 + 自定义 CSS | `@theme` design tokens + 手写编辑式排版 |
| 动效 | Framer Motion | 转场 / 滚动揭示 / 首屏入场，尊重 `prefers-reduced-motion` |
| 生成艺术 | Canvas 2D（原生） | 有意不用 Three.js：目标达成且更轻、更稳、无回退负担 |
| 静态展板 | SVG（确定性 seed） | 零成本渲染，随尺寸裁切自适应 |
| 路由 | React Router v6 | SPA 路由 + 静态托管回退 |
| 字体 | Fontsource | 本地打包，零外部请求 |

## 4. 项目目录

```
creative-archive/
├── public/                   # 静态资源（images / videos / textures）
├── src/
│   ├── components/           # Nav / Footer / PlateFrame / ProjectCover / Cover / ProjectCard / Reveal / StatusBadge / CustomCursor
│   ├── sections/             # Hero（首屏）
│   ├── generative/           # PrismHall.tsx —— Canvas 2D 主视觉引擎
│   ├── pages/                # Home / Works / ProjectDetail / About / Lab / NotFound
│   ├── hooks/                # usePageTitle
│   ├── data/                 # ★ 内容与数据独立管理
│   │   ├── projects.ts       #   项目数据（当前为空，附添加模板）
│   │   ├── categories.ts     #   五个分类
│   │   ├── labExperiments.ts #   实验室条目（当前为空，附添加模板）
│   │   ├── siteConfig.ts     #   站点配置（邮箱、社交占位）
│   │   └── translations.ts   #   UI 文案（en / zh）
│   ├── lib/                  # i18n（语言 Context）· text（标题断行）· asset
│   ├── styles/               # global.css（Design Tokens + 排版 + 中文调校）
│   ├── types/                # 共享类型
│   ├── App.tsx               # 路由 + 转场 + 布局
│   └── main.tsx
├── index.html
├── vite.config.ts
├── vercel.json               # SPA 静态托管回退
└── package.json
```

## 5. 本地运行

要求 **Node.js ≥ 18**。

```bash
npm install      # 或 pnpm install
npm run dev      # 默认 http://localhost:5173
```

## 6. 构建

```bash
npm run build    # 先 tsc 类型检查，再 vite 构建
npm run preview  # 本地预览生产产物
```

产物在 `dist/`，纯静态，可部署到任意静态托管。

## 7. 部署

一套代码、一个仓库、多个可替换环境：

- **Vercel（推荐）**：导入仓库即可；`vercel.json` 已把所有路径重写到 `/index.html`，直接访问 `/works/:slug` 刷新不会 404。
- **Netlify / Cloudflare Pages / GitHub Pages / 任意静态托管**：发布 `dist/`，并配置「所有路由回退到 `index.html`」。
- **中国大陆**：无外部依赖，可直接部署到符合备案要求的云服务器 / CDN；未来可做多入口分流（当前不做 DNS 分流）。
- **独立域名**：项目与平台解耦，`vite.config.ts` 的 `base` 已支持子路径部署。

## 8. 如何加入真实作品

内容全部在 `src/data/` 里，不需要改页面组件。

```ts
// src/data/projects.ts
export const projects: Project[] = [
  {
    id: 'my-project',
    slug: 'my-project',                 // → /works/my-project
    title: { en: 'My Project', zh: '我的项目' },
    category: 'original-worlds',        // 见 categories.ts
    description: { en: 'One line.', zh: '一句话。' },
    status: 'in-progress',
    featured: true,                     // 是否出现在首页墙面
    year: '2026',
    cover: 'images/my-project.jpg',     // 可选，省略则用生成展板
    gallery: ['images/a.jpg'],
    video: 'videos/my-project.mp4',     // 可选，本地 MP4 优先
    tools: ['React', 'Canvas 2D'],
    overview: { en: '…', zh: '…' },     // 可选章节，缺失即隐藏
    concept: { en: '…', zh: '…' },
    process: { en: '…', zh: '…' },
  },
]
```

实验室同理：往 `labExperiments.ts` 加一条，Lab 页的台账与首页实验区会自动更新；`version` / `date` 没有真实数据时省略，字段会自动隐藏。

联系邮箱填入 `siteConfig.contact.email` 后，联系区从「即将上线」变成可点击的 `mailto`；社交链接填入即出现在页脚，留空自动隐藏。

## 9. 诚实说明（未完成 / 占位）

- **作品与实验数据为空**：`projects.ts`、`labExperiments.ts` 刻意留空，等待真实作品。站内不编造客户、奖项、学历、工作经历或商业成绩。
- **主视觉是不依赖素材的程序化绘画**（Canvas 2D + SVG），没有使用任何第三方图片或视频。
- **About 页的人像位是排版展板**（"Portrait — not a photograph"），有真实照片后可直接替换为 `<PlateFrame>` 内的图片。
- **移动端**：响应式断点（单列 / 汉堡菜单 / `clamp()` 字号 / 减少粒子数量 / DPR 上限）已实现，但当前自动化环境无法切换浏览器视口，因此未提供移动端截图。
- **WebGL 回退不适用**：主视觉本身不使用 WebGL，低配设备与禁用硬件加速的环境同样可以正常显示；`prefers-reduced-motion` 下只渲染一帧静态画面。

## 10. 未来扩展

- 加入真实作品（世界观 / 游戏 / AI 影像 / 技术实验）与真实封面、画廊、视频。
- 为高配设备增加可选的增强层（如真实 3D 或 WebGL 版本），保持默认路径轻量。
- 增加作品搜索、年份视图或收藏序列；当前筛选与数据结构已为其预留。
- 视需要接入 CMS 或构建期数据抓取——核心页面目前不依赖任何后端。

---

Built with React · TypeScript · Vite · Canvas 2D.
