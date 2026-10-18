# 开发与维护

## 从哪里开始

从 [README](README.md) 了解运行入口，从[当前 API 合同](contracts/api.md)了解接口，从[文档索引](docs/README.md)找验证与历史资料。版本政策只在[存档政策](contracts/api.md#save-policy)定义。

保持现有目录：packages/core 负责纯规则和事件，apps/web 负责交互与本地保存，src-tauri 只做桌面封装。不要在 UI 复制规则算法；随机动作由明确用户操作触发；已完成 Session 保持锁定。

## 安装与验证

Node.js 22+，在仓库根目录执行：

```sh
npm ci
npm run check
npm run typecheck:web
npm run test:web
npm run fixtures
npm run build:web
```

开发用 `npm run dev:web`；桌面构建环境及命令见 [DESKTOP.md](DESKTOP.md)。用户直接运行离线 HTML／EXE，不需要开发工具。依赖必须沿用锁文件；构建时下载依赖不等于产品运行依赖网络。

修改应按原因保持局部，先执行受影响测试，再做所需完整回归。规则变动需来源与固定骰序列；UI 改动检查双语、无障碍、存档隔离和离线行为。不要为通过测试删减已有功能。

## 文档维护的四个检查项

1. 公共类型／签名是否变化？改 Core 类型，不在 contracts/types.ts 复制定义；当前合同解释字段含义。
2. 行为是否变化？直接改 api.md 对应章节，说明限制、错误和随机数／状态影响；不要追加“新版覆盖旧节”。
3. 存档政策是否变化？只改 api.md 的正式政策章节，并核对代码版本判定；README 只链接。区分产品承诺和遗留代码当前能接受什么。
4. 目录／样例是否受影响？运行 npm run fixtures，审查生成差异；catalog.json/examples.json 不手改。

变更沿革写 CHANGELOG；执行环境、实际测试和未验收项写发布验证记录。历史维护报告是快照，不应回填成另一套当前合同。下次发布时同步各包、规则版本和桌面版本是否需要更新，不能机械地把应用版本等同于存档版本。

本次文档整理没有新增自动检查脚本或 CI；上述流程是维护约定。若后续增加自动检查，应针对生成数据、可编译示例和明确政策字段，不逐字测试整篇 Markdown。

## 提交与交付

提交说明写清问题、最终行为、验证及限制。纯文档变动无需改功能版本或重建 HTML／EXE，需检查链接、文档与实现对应关系，并确认非文档文件未改变；涉及功能时按变化执行测试／构建。

源码 ZIP 不包含 .git、node_modules、构建缓存；包含约定交付的离线 HTML、Core 编译产物和 Windows 包。历史补丁已应用于源码，不应再次应用。准备上传 GitHub 时见[建仓说明](docs/github.md)。
