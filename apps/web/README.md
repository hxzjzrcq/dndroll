# DNDROLL 正式 Web UI

React 18 + TypeScript + Vite。所有规则操作通过 `@dndroll/core` 公共 API 完成；本目录不包含任何规则实现。

## 运行

```sh
# 仓库根目录
npm ci                 # 安装全部 workspace 依赖
npm run dev:web        # 开发服务器
npm run build:web      # 产出 dist/（常规 Vite 构建）与 dist-offline/index.html（单文件离线版）
npm run test:web       # Vitest + jsdom 行为测试（15 项）
npm run typecheck:web  # 前端 strict 类型检查
```

## 离线使用

`dist-offline/index.html` 由 `scripts/build-offline.mjs` 在 Vite 构建后内联全部 JS/CSS 生成。解压 ZIP 后双击该文件即可用 Firefox/Chrome 的 `file://` 打开；不需要网络、服务器或任何运行时依赖。同一套 `src/` 源码同时产出 dist 与 dist-offline，没有第二套界面。

## 结构

- `src/store.ts` — 会话控制器：只读派生（getSessionView）在渲染期，掷骰/修改只在事件处理器；自动保存到 localStorage，恢复失败显示错误而不静默清空。
- `src/App.tsx` — 版本导航、方法卡片（含待核准禁用）、开始前选项、阶段路由。
- `src/components/panels.tsx` — 掷骰、自由分配/十二取六/数组、二选一、十二套选一、逐骰分配、PF1 骰池、购点面板。
- `src/components/classTrade.tsx` — B/X/OSE 职业与主属性交换、规则重掷与主持人许可重建、完成锁定。
- `src/components/exporting.tsx` — 完成页、复制（失败如实降级为可选中文本+下载）、TXT/JSON 导出、存档导入校验。
- `src/i18n.ts` — 界面中英文案；规则文案全部来自核心。

## 说明

- 会话进度自动保存在浏览器 localStorage（仅本机本浏览器）；换机/清浏览器数据会丢失，跨设备请用"导出存档 JSON"。
- 掷骰使用 `crypto.getRandomValues`；测试中注入固定骰序列，生产界面不使用 `sequenceRng`。
