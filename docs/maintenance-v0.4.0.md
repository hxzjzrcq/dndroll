# DNDROLL v0.4.0 功能交付

唯一基线：已完成验收的 v0.3.0 完整源码项目。按任务书先通过 A 部分单人 DCC，再开发 B 部分调度和 UI；六项独立提交及补丁见 v0.4-patches/。本轮没有 PF2、完整人物卡、批量 ZIP、云存档或增量重放重构。

| 项目 | 主要文件 | 修改原因／测试 |
|---|---|---|
| V4-01 | Core types.ts、catalog.ts、index.ts、tests/dcc.test.mjs、core.test.mjs | 加入 DCC fixed 方法和指定内部顺序；收窄职业通知分支；固定 18 骰、重放、STR 18 无百分骰通过；原规则回归通过 |
| V4-02 | Core ability-display.ts、types.ts、index.ts；Web i18n.ts、App.tsx、common.tsx、HistoryPreview.tsx、exporting.tsx；映射／UI 测试 | 六槽映射集中于 Core；导出原生属性和映射；所有显示端复用；2E 灵知和其他版本名称不变 |
| V4-03 | Core dcc.ts、index.ts、types.ts；Web common.tsx、App.tsx、exporting.tsx、styles.css、i18n.ts；DCC 测试 | 独立 DCC 调整值表及 UI／TXT／JSON；3–18 全覆盖，非法输入拒绝 |
| V4-04 | Core batch.ts、errors.ts、index.ts、types.ts、tests/batch.test.mjs | 薄同步调度器复用独立 Session；组号错误、不返回部分结果、1/2/4/8、统一 RNG 流逐组等价、OD&D 与既有 d100 流程通过 |
| V4-05 | Web BatchPanel.tsx、App.tsx、i18n.ts、styles.css、test/batch.test.tsx | 独立批量内存状态，默认四组，严格适用性；不写单人 store／历史；语言和失败重复操作测试通过 |
| V4-06 | Web BatchPanel.tsx、exporting.tsx、App.tsx、i18n.ts、styles.css、test/batch.test.tsx | 按 #1～#N 显示、展开骰子、完整会话与映射、复用单人结果复制／导出；明确恢复才走原确认和保存逻辑；刷新清批量但保留当前会话 |

Core 路径基于 packages/core/src/，Web 基于 apps/web/src/；测试和构建产物随各项提交更新。最后集成更新版本号、合同、目录／样例、README、UI_DELIVERY、DESKTOP、验收记录与 Windows 成品。

兼容边界：内部 Ability 和 Action 结构保持六槽方案；DCC 对外结果增加 abilityMapping、nativeBaseScores、nativeScores、nativeModifiers。schemaVersion=1，rulesVersion=0.4.0-2026-10-18。仅承诺当前 v0.4 存档；不新增旧版适配。原 RuleError 抽到独立模块以避免批量模块的 ESM 初始化循环，公共根导出不变。

批量适用：DCC、OD&D、2E I、1E III、明确 inOrder 的 PF1 Classic。B/X/OSE 本版保留其可选职业及调整决策，不自动跳过。数量 API 允许 1–8 整数，UI 1/2/4/8 是工具预设。原 23 项随机方法的“再掷一组”及最近十组保持独立。

最终：Core 97/97、前端 77/77、类型／合同检查、fixtures、构建通过；真实 Chromium 断网 file:// 双语／主题／移动端及 DCC 批量验收通过。每组单独下载的 JSON 均与 Core 固定序列结果一致并可重放。

交付：根 DNDROLL-离线版.html（与 apps/web/dist-offline/index.html 字节一致）、完整源码、合同、规则来源和映射说明、测试／构建输出、浏览器验收记录。Windows/ 是新编译的 v0.4.0 便携版与安装包；未签名，Windows 实机尚未验收。其余待办和执行环境见 validation.md。
