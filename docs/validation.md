# v0.4.0 功能发布验证记录

本文是功能发布时的验收快照。本次文档整理的检查见 [documentation-v0.4.0.md](documentation-v0.4.0.md)；当前兼容政策统一见 [API 合同](../contracts/api.md#save-policy)。

日期：2026-10-18。基线为已验收的 v0.3.0 完整源码项目（Git `95ea7d4`），在该工作树继续开发；未从旧版 HTML 或 v0.2 源码重新开始。

环境：Linux x86_64；Node.js 24.19.0；TypeScript 5.9.3；React 18.3.1；Vite 5.4.20；Vitest 2.1.9、jsdom 25.0.1；Chromium 153.0.8010.0（headless）。

| 检查 | 实际结果 |
|---|---|
| 按锁文件安装开发依赖 | npm ci 完成；仅临时把镜像 resolved 主机换为官方源，随后恢复；未增加依赖或改变锁定版本／integrity |
| `npm run check` | Core 97 项通过，0 失败、0 跳过；包括原 68 项回归及新增 DCC／批量测试 |
| `npm run typecheck:web` | strict 类型检查通过 |
| `npm run test:web` | 10 文件、77 项通过，0 失败；原 v0.3 测试保留，目录数量／名称范围断言按新版本更新 |
| `npm run fixtures` | 17 份真实快照，10 个游戏入口，32 ready + 1 pending；生成目录与原生属性映射 |
| `npm run build:web` | 常规 Vite + 单文件离线构建通过 |
| 合同类型 | `tsc --strict --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext contracts/types.ts` 通过 |
| DCC 固定骰序列 | 18 个 d6 原样入日志；STR=3, DEX=18, CON=6, WIS=15, INT=9, CHA=12；原生输出 STR/AGI/STA/PER/INT/LCK 正确 |
| DCC 调整值 | 3–18 每个值与全部边界通过；非法值拒绝；无 D20 公式复用 |
| DCC 限制 | 不自由分配、无职业／购点／传奇力量；STR 18 不产生 d100；无误入 B/X/OSE 职业通知 |
| 映射与导出 | Core 和 Web 使用同一映射；2E WIS=灵知，其他原有版本=感知；DCC PER=人格，LCK=幸运；TXT／复制不出现 DEX/CON/WIS/CHA 伪属性名；结果 JSON 明示内部映射和原生分数／调整值 |
| 通用批量 | 同一 RNG 流生成四组，与连续四次正常生命周期的 Session、事件和完成状态完全一致；1/2/4/8 正常 |
| 独立审计 | 所有子会话独立 serialize/deserialize/view/validate；Session 和日志不共享可变对象；深冻结；完成后重复 roll 拒绝 |
| 失败行为 | 非法数量／不适用方法在消耗 RNG 前拒绝；缺骰指出组号及原因，不返回部分批量；重复生成失败明确保留上次成功结果 |
| 其他版本批量 | OD&D 顺序和值不变；2E I 的自动 d100 正常；1E III 和 PF1 明确依序模式适用；需要玩家选择的其他模式不自动完成 |
| 独立浏览器 bundle | 原测试通过，另实际调用 IIFE 中的 generateBatch 与 DCC 映射，无 Node 平台接口或网络依赖 |
| 当前存档与批量隔离 | StrictMode、浏览、主题／语言、预览、复制、下载不掷新骰，也不改当前存档／十组历史；取消替换保持原存档，确认仅恢复选中一组 |
| 批量存续 | 刷新后批量清空，明确设为当前会话的那一组仍正常自动恢复；中英说明存在 |
| 真实 file:// 单人回归 | 原方法 VI 原生键盘、18 上限、主题／语言、全文、JSON 文件／粘贴导入与导出、TXT 下载通过 |
| 真实 file:// DCC／批量 | 黄金序列、四组分别实际下载并对照 Core、1/2/4/8、原生结果 JSON／TXT、复制拒绝后的文本降级、明确恢复、刷新与 DCC 文件导入全部通过 |
| 离线资源 | 两套浏览器脚本均在断网模式运行，0 HTTP(S) 请求、0 脚本错误；无 disable-web-security；HTML 无外部 JS/CSS 和 modulepreload polyfill |
| 双主题及移动端 | 深浅主题视觉检查与对比度回归通过；390px DCC 批量页面无水平溢出；可复查脚本及数据见 v0.4-qa/ |
| 新 Windows 包 | v0.4.0 x64 release 与 NSIS 编译成功；PE 为 x64 GUI，版本资源含 0.4.0；替换了交付目录中的旧程序；校验和见 Windows/SHA256SUMS.txt |

新批量模块曾暴露 ESM 错误类初始化循环；已把原 RuleError 原样移至独立 errors.ts 并保持根导出，Node、IIFE、Web 完整回归通过。未修改 replay/applyAction 的状态机或随机数机制。B/X/OSE 仍保留玩家职业／主属性调整，本版批量只开放无需此类选择的方法；详见接口合同。

Windows 构建环境：Rust 1.99.1、cargo-xwin 0.23.1、LLVM/LLD 18、Tauri 2.12.4、NSIS 3.09，目标 x86_64-pc-windows-msvc。编译器探测、Microsoft 库调试 PDB、跨平台签名提示未阻止 release 与安装包生成。构建阶段需要工具下载；产品运行未增加在线依赖。

尚未执行 Windows 10/11 实机启动、安装／升级、WebView2 持久化和系统剪贴板验收；EXE／安装包未签名。未实测 Firefox、Safari、WebView2 111。发布时未增加旧 JSON 兼容代码；现行承诺及版本判定以 API 合同政策章节为准。DCC 的人物卡其他部分、PF2、批量整体 ZIP、云功能均未实现。

原始测试／构建输出：v0.4-logs/。可复查浏览器脚本、实际下载样例、结果数据：v0.4-qa/。QA 脚本通过环境变量指定开发用 Playwright／Chromium，不属于应用依赖。规则来源及译名映射另见 rules/dcc-v0.4.md。
