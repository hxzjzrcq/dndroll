> 历史记录：以下描述仅对应初始 v0.1。当前 v0.2 的新增与边界见 `verification-0.2.md`，当前支持情况以 README 与 Core 目录为准。

# 规则补核与实现边界 0.1.0

日期：2026-10-17。本文件补充初始清单，描述当前代码的实际范围；不把“找到概要”写成“完整实现”。

## 本轮补核

### B/X 低属性重建

Moldvay Basic p.B13 的 Hopeless Characters 条文允许 DM 将不适合冒险的低属性角色弃用并重新生成。程序提供主持人许可说明字段，不自动检测一个自创总和阈值。此操作只记录使用者声明的许可，不进行身份认证。

依据：[原书转录，检索 Hopeless Characters](https://www.scribd.com/document/980807420/D-D-Basic-Rulebook-Moldvay-Edition-Basic)。角色生成、交换步骤仍依 pp.B5–B6。

### B/X 与 OSE 的数值和职业边界

按六项基础属性 3–18 的范围处理普通创建阶段；交换不得把目标提高至 19。这个上限在实现中作为创建范围约束，并非声称 p.B6 有一条单独写明“交换最高 18”的句子。

七职业的 donor/target 表与前一清单相同。矮人需要 CON≥9；精灵需要 INT≥9；半身人需要 DEX≥9 且 CON≥9。基于生成后先选职业再调整的顺序，程序在原始值上检查这些职业门槛，不通过事后交换倒推资格。

依据：Moldvay Basic pp.B9–B10；OSE Classic 职业规则与 [SRD 角色生成](https://osesrd.opengamingnetwork.com/player-characters/)；[OSE Classic Genre Rules 文本索引](https://files.spawningpool.net/docs/Vault2.0.-.TTRPG-Gamebooks/Old-School%20Essentials%20BX%20Essentials/Old-School%20Essentials%20Classic%20Fantasy/Old-School%20Essentials%20Classic%20Fantasy%20Genre%20Rules%20%5Bv1.0%5D.pdf)。

### AD&D 1E UA 方法 V

原书 p.74 的骰数表已定位，确认没有合并网页额外插入的 Per 列。仅限人类、各池取最高三骰、职业最低/最高限制与 Comeliness 都属于该方法的完整实现。

原书 UA 的 cavalier / paladin 最低要求不能套用旧 PHB paladin 数值；取得的合并转录中还存在 cleric DEX 最低值等不一致。完整规则需要同时核对 PHB 各属性的职业限制与 UA 对新职业的修改，不能只把常见的主属性门槛填入表格。

因此本包保留 `adnd1e.ua-V` 目录和中英介绍，`status:'pending'`，`createSession` 明确拒绝。未将其算入 27 个可用方法。

依据：[UA 原书转录](https://dokumen.pub/official-advanced-dungeons-dragons-unearthed-arcana-a-compendium-of-new-ideas-and-new-discoveries-for-add-game-campaigns-of-benefit-to-players-and-dungeon-masters-alike.html)，pp.6、14–18、74。此处记录不复制整本或完整职业描述。

## 实际实现清单

| 游戏 | 可用方法数 | 本次实现 |
|---|---:|---|
| OD&D | 1 | 固定顺序的 3d6；经验换算未实现 |
| B/X | 1 | 固定顺序、七职业调整、许可重建 |
| OSE Classic | 1 | 固定顺序、七职业调整、许可重建；独立入口 |
| AD&D 1E | 4 | DMG I–IV；UA V 待核准 |
| AD&D 2E | 6 | PHB I–VI |
| D&D 3.5 | 3 | 标准掷骰及重掷资格、购点各预算、精英数组 |
| PF1 | 5 | Standard、Classic（含依序选项）、Heroic、24/28 骰池、各档购点 |
| 5E 2014 | 3 | 随机、数组、27 点购点变体 |
| 5E 2024 | 3 | 随机、数组、27 点购点 |
| 合计 | 27 | 不把预算与依序开关重复计作新方法 |

完整双语目录由引擎生成在 `contracts/catalog.json`，来源与初始清单对应。初始清单保留历史，不应忽略本文件对已完成/待核的更新。

## 工程决策（不伪装成额外官方规则）

- 购点超支可作为编辑中的临时状态保存，但不能完成；未用完预算时可明确确认保留。这是避免误操作的 UI/API 约定。
- AD&D 2E VI 的完成条件是分配全部七颗骰。分配可撤回、移动；不会拆骰或重复使用。
- 官方生成得到不喜欢的角色，使用者仍能新建独立会话；本会话中的重掷按钮只在相应规则/裁定适用时开放。
- 1E II 在第六名处并列时任意保留同值候选，但完整结果必须等于最高六个数值。不会因 ID 排序偏好强制挑某颗同值骰。
- 不替旧版每项属性输出统一的现代 `(score−10)/2` 调整值。这个公式只在 3.5 的重掷资格内部使用。
- 已完成的会话锁定。所有编辑产生新会话对象，旧对象不变；操作记录重放用于一致性验证，不提供防篡改证明。

## 已知未实现项目

UA V 完整生成；OD&D 主属性经验换算；卓越力量 18/xx；种族、背景、年龄调整；完整职业/种族合法性；OSE Advanced 与 2026 更新的扩展职业；AD&D 2E Skills & Powers；3.5 的其他五个 DMG 变体；自定义房规编辑；QQ 网络连接；正式网页 UI；Windows 安装包。

这些未实现项目不允许由 UI 模型自行补写。可以在后续单独补入核心，版本化更新。
