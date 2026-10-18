# DNDROLL v0.3.0 维护交付

按 `DNDROLL_v0.3_更新任务书.md` 的 V3-01～V3-07 顺序完成。未添加规则、批量生成、预设或网络服务。所有 Core 源码、测试、构建产物和接口合同保持基线不变；Core 包仍为 0.2.0，应用／Web／Tauri 版本为 0.3.0。

| 项目 | 修改文件 | 原因与验证 |
|---|---|---|
| V3-01 | components/panels.tsx、i18n.ts、styles.css、test/maintenance.test.tsx | 属性格改为 div，放置／撤回改用同级原生 button；原生键盘、无嵌套、固定事件结果及原上限测试通过 |
| V3-02 | styles.css、test/theme.test.mjs | 将按钮、选中、徽章、候选、错误／警告、通知、焦点、悬停改用双主题语义变量；骰子独立色板；使用兼容 rgba 而非新色彩函数；AA 与截图通过 |
| V3-03 | App.tsx、i18n.ts、components/DieFace.tsx/common.tsx/panels.tsx/classTrade.tsx/exporting.tsx、test/maintenance.test.tsx | 显式 locale，关闭／弃骰双语，html.lang 同步；语言切换不改变 JSON |
| V3-04 | historyView.ts、App.tsx、test/history-cache.test.tsx | Web WeakMap 按不可变 Session 身份缓存，无 Core 重放改造；spy 证明缓存命中、更新失效、恢复复用及语言切换 |
| V3-05 | vite.config.ts | modulePreload.polyfill=false；独立前后构建减少 710 字节；真实离线导入导出通过 |
| V3-06 | styles.css、test/maintenance.test.tsx | 选中方法卡展开完整说明，保留右侧全文；不产生新 Session，pending 禁用和键盘导航保留 |
| V3-07 | i18n.ts、App.tsx、components/common.tsx/panels.tsx/exporting.tsx、test/ability-name.test.tsx | getAbilityName(versionId, ability, locale) 统一解析；仅 2E 中文 WIS 为灵知；数值、ID、事件、JSON 不变；历史／TXT／复制沿用 WIS 缩写 |

表内源码路径相对于 `apps/web/src/`（vite.config.ts 相对于 apps/web）。7 个独立提交导出为 `v0.3-patches/0001…0007`；每份包含针对性修改／测试。最后的交付集成更新包版本、README、UI_DELIVERY、DESKTOP、本记录、验证记录、构建产物与 Windows 新包。没有新增 npm 依赖。

测试：基线 Core 68／UI 55；最终 Core 68／UI 68，类型检查和构建通过。13 个新增前端测试覆盖本次行为；真实 Chromium 断网 file:// 验收与双主题截图通过。完整命令、环境、尺寸和限制见 `validation.md`。

交付入口：根目录 `DNDROLL-离线版.html`；源码工程含同内容的 `apps/web/dist-offline/index.html`。Windows/ 下是重新编译的 0.3.0 便携程序和安装包，不是旧版拷贝。Windows 实机运行／安装／升级及系统剪贴板尚未验证，二进制未签名。

本轮不扩展旧 JSON 兼容；既有 Core 兼容代码和原测试保留。公共接口、规则参数、骰点公式、来源 URL、UA V pending 均未改变，因此 contracts/ 不需要更新。
