# UI 交付说明（apps/web）

本文件保留交付时的历史快照，当前接口及兼容政策见 [API 合同](contracts/api.md)，文档导航见 [索引](docs/README.md)。

当前版本为 v0.4.0；下方为首次交付的历史记录，不能作为当前验收结果。当前结果：Core 97 项、前端 77 项通过，类型检查、合同类型与离线构建通过；真实 Chromium 在断网 file:// 完成单人回归、DCC 固定序列、批量 1/2/4/8、逐组下载／重放、语言／主题、恢复及导入导出验收。详见 `docs/validation.md` 和 `docs/maintenance-v0.4.0.md`。

日期：2026-10-17。下述首次交付记录保留；本轮定向维护的变更与独立复测见 `docs/maintenance-v0.1.0.md`。规则核心 0.1.0-2026-10-17 未做任何修改；本次只新增 `apps/web`、根 `package.json` 增加四条 web 脚本、`package-lock.json` 注册前端依赖、`.gitignore` 保留 `dist-offline/`、本文件与 `docs/ui-screenshots/`。

## 运行方法

```sh
npm ci                 # 根目录安装全部 workspace 依赖（Node ≥ 20 实测通过）
npm run dev:web        # 开发预览
npm run build:web      # 构建 apps/web/dist 与 apps/web/dist-offline/index.html
npm run test:web       # 前端行为测试
npm run typecheck:web  # 前端类型检查
npm run check          # 原有核心检查（构建 + 46 项测试），未改动
```

最终用户不需要上述任何命令：解压后双击 `apps/web/dist-offline/index.html` 即可。

## 检查结果（本机实测）

| 检查 | 结果 |
|---|---|
| `npm run check`（核心） | 通过：46 项测试全过 |
| `npm run typecheck:web` | 通过（strict，0 错误） |
| `npm run test:web`（Vitest + jsdom） | 通过：15 项。覆盖普通分配、2E II 选低值、1E IV 整套选择、2E VI 分骰与 18 上限报错、PF1 28 骰池先配后掷、3.5/PF1/5E 三套购点成本（含负成本、超支禁止完成、未用完须确认）、OSE 盗贼 INT→DEX 交换与供出限制、自动存档恢复、损坏存档报错、导入合法/非法存档、中英切换不重掷 |
| `npm run build:web` | 通过：dist + dist-offline 单文件（约 225 KiB，无外链资源） |
| file:// 真实浏览器验收 | **已测试**：Chromium 无沙箱模式，两轮脚本跑完"选版本→选方法→掷骰→分配→锁定→复制→切英文→切回"全流程，控制台 0 错误；UA V 禁用项点击无反应；复制在 headless Chromium 的 file:// 下成功（失败路径有可选中文本+下载降级，代码内实测分支存在）。**Firefox 未实测**，按 file:// 标准行为实现（内联 module 脚本、无 fetch 外链），风险低但未验证 |
| 移动端（390px） | 已截图核验：无页面级横向滚动，版本栏横向滚动，按钮 ≥44px |

测试使用固定骰序列驱动真实 DOM 交互；产品界面只用 `cryptoRng`。

## 截图（docs/ui-screenshots/）

- `01-home.png` 初始空状态；`02-method-config.png` 方法选项；`03-assign.png` 候选分配（含舍弃骰划线）；`04-assigned.png` 分配完成待锁定；`05-complete.png` 完成结果与导出；`06-copy-feedback.png` 复制反馈；`07-english.png` 英文界面（结果不变）；`08-mobile.png` 移动端；`09/10-pf1-pool-*.png` PF1 骰池配置；`11/12-pointbuy*.png` 购点；`13-sets.png` 1E IV 十二套（含 UA V 待核准禁用）；`14-mobile-sets.png` 移动端十二套。

## 接口缺口

无。`contracts/api.md` 所述全部接口在 UI 中按约定使用，未发现需要绕过或补写的缺口，故未创建 BLOCKERS.md。

## 已知问题

1. 桌面浏览器验证使用 Chromium；Firefox 的 file:// 未实测（见上表）。
2. headless 环境无法验证真实剪贴板权限弹窗；复制失败分支（显示可选中文本 + 下载 TXT）已实现并在单元层面成立，但 file:// 下的真实拒绝路径未在带界面的浏览器中人工触发。
3. 会话自动保存于 localStorage，仅本机本浏览器；导入/导出 JSON 是跨设备的正式途径。
4. `apps/web/dist`（未内联的常规构建）需要静态服务器打开；双击请用 `dist-offline/index.html`。

## 本轮维护复测

前端现为 18 项测试，全部通过；Core 46 项测试与前端类型检查、构建通过。损坏存档在明确清除前暂停自动保存；版本及方法选择只浏览，点击开始生成才创建会话，已有进度须确认替换。维护环境缺少浏览器可执行文件，因此本轮未重新验证 file://、移动布局或剪贴板权限；上表为首次交付历史结果。

## 快速生成与最近十组（2026-10-17）

新增 20 项随机方法的“再掷一组”及当前页面内存历史，最多 10 组。恢复完整 Session，支持分配和锁定状态；刷新后仅恢复原有当前会话存档，不保存历史列表。PF1 沿用已确认骰池配置。UI 通过 Core 既有 API 生成独立 Session，不改变规则内重掷。

当前前端 45 项测试全部通过（原 18 项 + 新增 27 项），Core 46 项通过，类型检查、构建通过。新产物经过 jsdom 交互烟雾检查（Node 补充 structuredClone），无外部脚本/样式；不等同真实浏览器 file:// 验收。此前用户已验证旧离线版可直接打开并复制到其他位置；新功能版本待用户浏览器复核。

新增测试：`apps/web/src/test/quick-roll.test.tsx`。修改：`store.ts` 的内存历史与快速生成、`App.tsx` 的按钮与历史入口及面板重置、`i18n.ts` 的中英文文案、`styles.css` 的历史按钮换行，以及 `build-offline.mjs` 的根目录成品副本。Core、合同、依赖与规则版本不变。

构建现在同时输出根目录 `DNDROLL-离线版.html`，用户应打开此文件或 `dist-offline/index.html`，不要双击常规 `dist/index.html`。

## 数值预览、按钮位置与浅色模式（2026-10-17）

- 历史条目直接显示候选总和、当前属性位置与数值。2E II 按属性展示两个候选；2E VI 展示原始七骰与当前分配；1E IV 的十二套按套折叠列出，标记已选套。只显示 Core 提供的值，不重算规则。
- 快速生成按钮从工作区标题移至数值面板前方的 sticky 工具条，滚动时保持可见。仍只有一个“再掷一组”按钮，操作与历史机制不变。
- 顶部新增浅色／深色切换，白底黑字主题同步调整面板、骰面、错误提示及按钮。主题记入现有 prefs；历史列表仍不持久保存。
- 修改 App.tsx、store.ts（仅增加配色偏好）、i18n.ts、styles.css；新增 components/HistoryPreview.tsx 和 test/display.test.tsx。
- 当前前端 49 项、Core 46 项测试通过，类型检查和构建通过；新产物经过 jsdom 交互检查。无真实浏览器布局、sticky 位置或主题截图验收，本环境仍缺少浏览器可执行文件。

## Tauri Windows 封装（2026-10-17）

新增 `apps/web/src-tauri`，沿用现有 web build 和 Core，前端通过 `frontendDist` 嵌入程序。新增 root/web 桌面构建脚本、锁定 @tauri-apps/cli 2.12.3、Cargo.lock、Windows 图标、DESKTOP.md 和 build-windows.cmd。无前端业务逻辑及规则修改。

构建环境：Linux、Rust 1.99.1、cargo-xwin 0.23.1、LLVM/LLD 18、目标 x86_64-pc-windows-msvc；Tauri crate 2.12.4。Windows 便携 EXE 编译成功，约 5.6 MiB。PE 检查为 x86-64 Windows GUI；导入表无需另带 VC++ 或 WebView2Loader DLL（仍需要系统安装 WebView2 Runtime）。链接器提示缺少 Microsoft 库的调试 PDB，不影响 release EXE 生成。

本轮前端类型检查与 49 项测试通过，Core 未修改，原 46 项测试结果保留。Tauri 配置通过 CLI 读取，Rust manifest/lock 解析通过。未进行 Windows 实机运行、复制、下载与持久化验收。程序没有签名。

NSIS 安装版已成功生成（1.59 MiB），配合便携 EXE 放在工程根目录 `Windows/`；未签名，未进行 Windows 实机验收。

## v0.2.0：2E 方法 VII–X 与传奇力量

2026-10-17。本轮改变规则能力，所有包与桌面版本升至 0.2.0，规则版本 0.2.0-2026-10-17。1E/2E 骰点、分配、骰池在真实 STR 到达 18 时自动记录独立 d100 事件；VII/IX 点击投；X 按原规则购买。忽略职业/种族/性别资格与上限的工具约定在界面/导出中注明。百分骰只投一次且随分配缓存。旧 0.1 存档只读恢复不补骰，首次继续修改升级；旧锁定结果保持不变。

新增四个方法：VII（75 点）、VIII（24d6，每项 3–6）、IX（2d6 的 11 档预算/上限）、X（75 点含百分比购买）。Core 源码、类型、目录、合同、fixtures、Core 分发包和回归测试同步更新；UI 增加 ExceptionalPanel、随机预算步骤、骰池上限和 18/xx 的预览/历史/最终结果显示。保持 Core/UI 分离，无非必要运行依赖。

Core 68 项、前端 55 项测试通过，前端类型检查通过；离线 HTML 构建通过，并用 jsdom 检查了新目录、自动百分骰、快速生成、历史恢复及主题/语言不改结果（Node 提供 structuredClone）。Windows 实机尚未验收。

v0.2 Windows x64 便携 EXE 与 NSIS 安装版均构建成功并经过 PE 格式检查；程序未签名，Windows 实机仍待验收。
