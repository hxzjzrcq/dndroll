# 文档索引

## 当前维护入口

| 文档 | 职责 |
|---|---|
| [根 README](../README.md) | 运行、功能概览、安装／构建入口 |
| [API 合同](../contracts/api.md) | 当前行为、字段解释、映射、批量与错误 |
| [存档政策](../contracts/api.md#save-policy) | 兼容承诺与当前版本判定的唯一正式入口 |
| [贡献与维护](../CONTRIBUTING.md) | 修改边界、验证命令、文档维护检查项 |
| [GitHub 建仓](github.md) | 从源码 ZIP 建立仓库，无需改目录结构 |
| [变更记录](../CHANGELOG.md) | 版本沿革，不覆盖当前合同 |
| [桌面说明](../DESKTOP.md) | Windows 构建／运行条件和实机验收边界 |

## 代码与生成资料

- [公共类型转接](../contracts/types.ts)直接引用 Core；实际签名以 Core 入口／声明为准。
- [方法目录](../contracts/catalog.json)、[会话样例](../contracts/examples.json)由 npm run fixtures 生成，不手工维护。
- [规则资料](rules/)记录来源和未核准范围；[DCC 映射说明](rules/dcc-v0.4.md)解释批准的六槽方案，当前 API 映射见合同。

## 发布验证与历史快照

[validation.md](validation.md)记录 v0.4 功能发布验收；本次只整理文档，不重新声称执行功能测试。文档整理检查见[本轮记录](documentation-v0.4.0.md)。v0.4-logs/ 与 v0.4-qa/ 是相应发布的输出／复查脚本；v0.3 的记录保留在对应目录。

maintenance-v0.1.0.md、maintenance-v0.3.0.md、maintenance-v0.4.0.md、根目录 UI_DELIVERY.md 及 CLAUDE_PROMPT.txt 都是历史交接资料，不能用来覆盖当前合同。历史报告中的版本和测试数按当时上下文解释。

v0.3-patches/、v0.4-patches/ 保存已应用的历史补丁，用于审查，不代表 GitHub 仓库自动拥有这些提交历史。根目录 dndroll-core-0.2.0.tgz 是旧包归档，当前 Core 应从 packages/core 使用。
