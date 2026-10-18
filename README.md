# DNDROLL 完整项目 0.4.0

包含独立 TypeScript Core、React + Vite 图形界面与离线单文件 HTML。另含 Tauri 2 Windows 桌面封装，构建和使用说明见 `DESKTOP.md`。

## Windows EXE

`Windows/DNDROLL-Windows-x64.exe` 为便携版；`Windows/DNDROLL-Windows-x64-setup.exe` 为安装版。需要 WebView2；安装版在缺失时联网补装。已编译，Windows 实机验收待完成。详情见 `DESKTOP.md`。

## 直接使用

解压后双击根目录 `DNDROLL-离线版.html`（与 `apps/web/dist-offline/index.html` 内容一致），无需安装 Node.js 或启动服务器。前端交付说明见 `UI_DELIVERY.md`，v0.4 功能记录见 `docs/maintenance-v0.4.0.md`，逐项补丁见 `docs/v0.4-patches/`。

## v0.4 新增：DCC 与批量属性生成

DCC 按 STR、AGI、STA、PER、INT、LCK 依次投 3d6；显示力量、敏捷、耐力、人格、智力、幸运及 DCC 专用调整值。无自由重排、购点或传奇力量。只生成属性，不生成完整零级人物卡。官方来源及中央映射见 `docs/rules/dcc-v0.4.md`；对外结果 JSON 包含原生分数／调整值及内部槽位映射，Session JSON 继续用于独立事件审计。

选中支持的方法后可“生成批量”，默认 4 组，可选 1/2/4/8。允许 DCC、OD&D、AD&D 2E I、AD&D 1E III，以及明确依序的 PF1 Classic。需要玩家决定的分配、候选、骰池、购点等方法不自动处理；B/X/OSE 保留其职业／主属性调整选择，本版不开放批量。

每组可展开骰子、查看完整会话、下载独立 JSON、复制／下载文本和导出结果 JSON。批量仅在本页内存中保存，刷新／关闭后清空；查看和导出不改当前存档与最近十组。只有明确点击“设为当前会话”才复用既有确认和自动保存机制。再次生成替换本批量；如失败，错误指出组号，仍显示上次成功批量。

Core 的 `generateBatch` 只调度原有 createSession/applyAction，不复制骰点引擎；每组拥有独立事件和可重放 Session。API 可接受 1–8 整数，UI 预设不是 DCC 规则的人数限制。合同见 `contracts/api.md`。

## 当前实际支持

10 个游戏入口，32 个可用方法。OD&D、B/X、OSE、AD&D 1E I–IV、AD&D 2E I–X、D&D 3.5 的标准掷骰/购点/精英数组、PF1 五类方法、5E 2014 和 2024 各三种，以及 DCC 的 3d6 顺序生成。

- 每种方法均有中英名称、解释、来源和规则状态。
- 支持自由分配、固定顺序、候选二选一、十二选六、十二套选一、整颗骰子分配、掷前骰池配置、购点。
- B/X 与 OSE Classic 七职业的主属性交换和必要最低属性检查。
- 3.5 的低属性整组重掷；B/X/OSE 主持人许可重建及说明记录。
- 原始骰子与操作日志、确认锁定、JSON 存档与恢复、中英结果文本。
- Core 不依赖浏览器、React、QQ 或桌面框架；Core 运行时零第三方依赖。

UA 方法 V 保留为 pending，不可运行。其职业约束尚未完整核准。已包含 1E/2E 传奇力量和 2E Skills & Powers 方法 VII–X；OD&D 经验换算、种族/背景调整、Skills & Powers 的十二子属性及其他模块、3.5 其他五项 DMG 变体仍未实现。详见 `docs/rules/verification-0.1.md`。

## 2E 扩展与传奇力量

VII（75 点）、VIII（24d6，每项 3–6）、IX（2d6 随机预算与上限）和 X（75 点含传奇力量购买）。点分配必须花完；X 的 18/30 成本 21，18/00 成本 28。1E/2E 的骰点和分配方法在 STR 18 时自动投 d100；VII/IX 点击投骰；X 购买。同一组只投一次，STR 移走再返回沿用原百分比，100 显示为 00。按使用者约定，不校验职业、种族、性别资格或上限，界面明确提示。百分比独立于整数 STR 保存，JSON、文本结果、历史与结果面板均显示。

## 快速生成与历史

顶部可一键切换深色／白底黑字浅色模式，记住配色偏好且不影响会话。历史条目显示候选数值及当前属性；十二套可展开查看。快速掷骰工具条位于数值区前，随滚动保持可见。

23 项随机方法（含方法 IX 的随机预算）在首次掷骰后提供“再掷一组”，沿用当前方法和选项；PF1 骰池沿用已确认的骰数配置。最近 10 组保存在当前页面内存，点击历史可恢复完整分配与锁定状态，不重新投骰。刷新或关闭后历史清空；现有自动存档仍只保存当前会话。除随机预算方法 IX 外，购点、固定数组和待核准方法不提供此按钮。

## 文件用途

| 路径 | 用途 |
|---|---|
| `packages/core/src` | TypeScript 规则与中英文案源代码 |
| `packages/core/dist` | 已编译 ESM、类型声明、独立浏览器脚本；可直接使用 |
| `packages/core/tests` | 固定骰子规则测试、生命周期与存档测试 |
| `contracts/api.md` | Core 与 UI 使用的实际接口合同 |
| `contracts/examples.json` | 由真实引擎产生的各阶段示例 |
| `contracts/catalog.json` | 引擎导出的完整中英方法目录 |
| `examples/demo.mjs` | 可运行的 AD&D 2E VI 示例 |
| `examples/bot-adapter.mjs` | 不连接 QQ 的机器人适配示例 |
| `apps/web` | React + Vite UI、行为测试及离线构建 |
| `docs/rules` | 初始清单、后续补核与明确限制 |
| `docs/validation.md` | 本次实际验证结果 |
| `CLAUDE_PROMPT.txt` | 第一阶段 UI 开发提示词（历史交接参考） |

## 给开发模型的运行说明

预编译产物已随包提供。安装 Node.js 22+ 后，不安装任何依赖即可运行：

```sh
node examples/demo.mjs
node --test packages/core/tests/*.test.mjs
```

重建源码需要锁文件中的开发依赖：

```sh
npm ci
npm run check
npm run fixtures
npm run dev:web        # 前端开发
npm run test:web       # 前端行为测试
npm run typecheck:web  # 前端类型检查
npm run build:web      # 常规与离线单文件构建
```

构建需要开发依赖，最终运行不需要网络。不要把“构建时需要下载依赖”与“用户使用时需要网络”混为一谈。

浏览器有两种接入方式：正式 React/Vite UI 导入 `@dndroll/core`；无构建环境可使用普通 script 加载 `packages/core/dist/dndroll.browser.js`，全局对象为 `DndRoll`。不要用 `file://` 加载 ESM 源文件来冒充双击可用的离线版。

## 版本、文档与接手

应用版本为 v0.4.0。当前接口、字段和限制见 [API 合同](contracts/api.md)，存档兼容承诺及实际接受的版本统一见[存档政策](contracts/api.md#save-policy)。本文不另行规定兼容范围。

- [文档索引](docs/README.md)：区分当前合同、生成资料和历史快照。
- [CHANGELOG](CHANGELOG.md)：版本沿革。
- [CONTRIBUTING](CONTRIBUTING.md)：开发验证和文档维护流程。
- [GitHub 建仓说明](docs/github.md)：解压后可直接以项目根目录建立仓库。

本次文档整理只更新完整源码 ZIP，不改变功能版本、HTML 或 EXE。源码包不含 .git 提交历史，也未连接远端；保留的历史补丁已经应用，不要重复应用。根目录旧版 Core tgz 仅为归档，当前包位于 packages/core。
