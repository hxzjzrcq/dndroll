# v0.4.0 文档整理记录

日期：2026-10-18。基线：v0.4.0 功能发布快照，Git 0dd7396。应用版本仍为 v0.4.0。

## 修改范围

- contracts/api.md：改为按当前行为组织的单一合同，整合选项、动作、传奇力量、DCC、批量、错误和导出说明；将兼容承诺与代码实际接受的版本分别列出。
- CHANGELOG.md：单独保存版本沿革，不承担当前接口约定。
- CONTRIBUTING.md：维护边界、现有验证命令、文档四项检查与提交交付流程；本次不添加自动检查脚本。
- docs/README.md、docs/github.md：文档索引和从 ZIP 建仓的步骤，说明历史补丁已应用、ZIP 不带 .git。
- README.md：保留运行、安装、测试、构建说明，增加维护入口，存档政策改为引用合同。
- UI_DELIVERY.md、docs/validation.md：标识为发布验收／历史快照，链接当前合同，避免作为第二份政策。

源码、类型、测试、脚本、依赖、生成目录／样例、HTML 和 Windows 二进制保持原字节。既有历史资料、旧包归档和补丁保留；未创建或连接 GitHub 仓库，未执行远端推送。

## 检查与边界

本轮只验证文档与实现对应、相对链接、非 Markdown 字节一致性及交付 ZIP 内容，不重跑功能测试、不重建 HTML／EXE。先前 Core 97／Web 77 等功能结果仍按发布时的 [validation.md](validation.md) 记录解释，不算成本轮重新测试。存档承诺唯一入口见 [API 合同](../contracts/api.md#save-policy)。

GitHub 建仓直接使用解压后含 package.json 的目录；现有 .gitignore 保留。可以从一次初始提交开始，历史补丁供审查，不能重新套用到现有源码。详细步骤见 [github.md](github.md)。

实际检查通过：198 个原有非 Markdown 文件逐字节一致；47 个文档相对链接／指定政策锚点存在。打包时另检查 ZIP 完整性及全部非 Markdown 成员与原 v0.4 ZIP 一致。
