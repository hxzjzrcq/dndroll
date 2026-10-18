# DNDROLL：各版本规则与中英说明清单 v0.1

整理日期：2026-10-17。用途：人类审阅需求、规则引擎开发、前端交接。

本清单覆盖此前约定的版本与核心属性生成方法，不声称收录 D&D 历史上所有扩展、杂志与战役规则。中英说明是为本工具撰写的简述，不是书中原文或官方中文译文。方法编号保留原书编号；中文描述性名称为本项目暂定。

## 1. 范围与核验状态

首版目标是“基础属性生成器”，并非完整人物卡。对属性生成不可缺少的选择、分配和限制必须实现；种族、背景、年龄、职业资格、卓越力量等后续规则另列，不能把基础属性输出冒称为最终人物卡。

状态含义：

- **已核对**：本轮已取得规则正文、公开规则或原书文本转录，可以据此设计方法；不代表代码已经完成。
- **待补核**：已确认存在或流程概要，但关键表格、适用范围或解释仍需补核；不得先做成“官方已支持”。
- **后续模块**：与生成有关，但不属于本轮基础方法的实现。

| 游戏入口 | 依据与方法范围 | 本轮状态 |
|---|---|---|
| OD&D（1974） | Men & Magic：3d6 依序；不混入后续补充册 | 基础生成已核对；主属性经验换算待补核 |
| B/X D&D（1981） | Moldvay Basic：3d6 依序；职业限定的属性调整 | 已核对；重建裁定细节待补核 |
| Old-School Essentials（OSE） | Classic Fantasy / Basic Rules 的已核对文本：3d6 依序、调整、低属性裁定 | 已核对；Advanced 职业另核 |
| AD&D 1E | DMG 方法 I–IV | 已核对，正文转录及 Dragon 的原方法复述 |
| AD&D 1E — Unearthed Arcana | 方法 V | 流程、仅限人类已核对；完整数据表与附加步骤待补核 |
| AD&D 2E | PHB 方法 I–VI | 已核对，PHB 文本转录 |
| D&D 3.5 | PHB 标准掷骰；DMG 购点、精英数组 | 已核对；其余 DMG 方法见附录 |
| Pathfinder 1E | CRB 五类方法及其中的规则选项 | 已核对，Archives of Nethys |
| D&D 5E（2014） | 随机、标准数组、27 点购点变体 | 已核对，官方 Basic Rules |
| D&D 5E（2024） | 随机、标准数组、27 点购点 | 已核对，官方 Free Rules |

OSE 保留独立游戏入口。当前说明锁定已核对的 Classic/Basic 文本，不把 2026 更新、Advanced Fantasy、未来中文出版物自动视为同一份已审核资料。它们可共用算法，但来源与职业规则必须分别记录。

未列入此次范围：Holmes、BECMI / Rules Cyclopedia、D&D 3.0、D&D 4E、PF2，以及各版杂志与其他补充册。未列入不等于没有相应方法。

## 2. 通用表达与属性顺序

| 术语 | 向用户解释 |
|---|---|
| 3d6 | 掷三颗六面骰并相加。 / Add the results of three six-sided dice. |
| 4d6 去最低 / 4d6, drop lowest | 掷四颗，去掉一颗最低骰，余下三颗相加；并列最低也只去掉一颗。 / Roll four dice; remove one lowest die and total the other three. |
| 依序 / In order | 每次结果已有指定属性，不能自由调换。 / Each result belongs to a specified ability. |
| 自由分配 / Assign freely | 玩家把六个结果各分配到一个属性，不重复使用。 / Assign each of the six results to a different ability. |
| 主属性 / Prime requisite | 旧版职业的重要属性，可能涉及经验奖励；不是现代“熟练加值”。 / A class-specific key ability, sometimes used to determine XP adjustments. |
| 基础属性 / Base scores | 本生成步骤的输出，未应用种族、背景等后续调整。 / Scores before later adjustments such as race or background. |

| 规则组 | 依序掷骰时的属性顺序 |
|---|---|
| OD&D | 力量 STR → 智力 INT → 感知 WIS → 体质 CON → 敏捷 DEX → 魅力 CHA |
| B/X、OSE、AD&D 1E 方法 III / IV | STR → INT → WIS → DEX → CON → CHA |
| AD&D 2E 方法 I / II；3.5 依序变体 | STR → DEX → CON → INT → WIS → CHA |

界面可以切换显示顺序，但不得改变原来“第几次掷骰属于哪个属性”的对应关系。内部用 STR 等稳定标识存储，不能只用数组位置代替属性名称。

## 3. OD&D（1974）

### 3.1 三骰依序 / 3d6 in order

建议标识：`odnd1974.3d6-in-order`。状态：已核对。[S1]

**中文说明：**依次为力量、智力、感知、体质、敏捷、魅力各掷一次 3d6。每次总和直接成为对应属性，不能自由排列。原始流程由主持人掷骰，随后玩家选择角色类型。

**English:** Generate one 3d6 total for each ability in this order: STR, INT, WIS, CON, DEX, CHA. Keep each result in its assigned position. The original procedure has the referee roll before the player chooses a role.

交互：掷骰 → 显示六项及明细 → 接受结果。

**后续边界：**Men & Magic 的其他属性向主属性换算涉及经验获取。不能直接套入 B/X/OSE 的实际属性交换算法。本轮保留原始六项；该换算需单独确定文本解释与适用范围后再实现。Greyhawk 等补充册不自动启用。

## 4. B/X D&D（1981）

### 4.1 三骰依序 / 3d6 in order

建议标识：`bx1981.3d6-in-order`。状态：已核对。[S2]

**中文说明：**按力量、智力、感知、敏捷、体质、魅力的顺序，各掷一次 3d6。生成后选择职业；如进行主属性调整，按该职业允许的交换执行。

**English:** Roll one 3d6 total for STR, INT, WIS, DEX, CON, and CHA, in that order. Choose a class afterward. Any prime-requisite adjustments must follow that class's permitted exchanges.

### 4.2 主属性调整 / Prime-requisite adjustment

这是生成后的可选步骤，不是另一套掷骰法。[S2]

**中文说明：**把允许降低的属性减少 2 点，以提高职业主属性 1 点；供出点数的属性不得降至 9 以下。不能任意交换所有属性。

**English:** Reduce an eligible ability by 2 to increase a class prime requisite by 1. The reduced ability must remain at least 9. Exchanges are restricted by class.

| 职业 | 可降低的属性 | 可提高的主属性 |
|---|---|---|
| 战士 Fighter | INT、WIS | STR |
| 矮人 Dwarf | INT、WIS | STR |
| 精灵 Elf | WIS | STR 或 INT |
| 半身人 Halfling | INT、WIS | STR 或 DEX |
| 魔法师 Magic-User | STR、WIS | INT |
| 牧师 Cleric | STR、INT | WIS |
| 盗贼 Thief | INT、WIS | DEX |

DEX 不能降低；CON、CHA 不参与这种交换。调整日志与原始掷骰分别保存。

待补核：低属性角色的弃用/重建具体措辞，以及调整上限的原书依据。实现前不能凭 OSE 的文字补写 B/X 的判定。

## 5. Old-School Essentials（OSE）

### 5.1 三骰依序 / 3d6 in order

建议标识：`ose-classic.3d6-in-order`。状态：已核对。[S3]

**中文说明：**按 STR、INT、WIS、DEX、CON、CHA 的顺序各掷一次 3d6。属性生成后选择职业，再决定是否进行允许的主属性调整。

**English:** Roll 3d6 for each ability in the order STR, INT, WIS, DEX, CON, CHA. Then choose a class and decide whether to make permitted prime-requisite adjustments.

### 5.2 主属性调整 / Prime-requisite adjustment

**中文说明：**降低非主属性的 STR、INT 或 WIS，每减少 2 点换取主属性增加 1 点，降低后不能少于 9。职业限制仍适用；例如盗贼不能降低 STR。

**English:** Trade 2 points from an eligible non-prime STR, INT, or WIS score for 1 prime-requisite point; the donor must remain at least 9. Class restrictions apply—for example, thieves cannot reduce STR.

### 5.3 低属性重建 / Sub-par characters

**中文说明：**属性特别差时，可请主持人允许弃用并重新生成；这不是自动重掷规则。

**English:** The referee may permit a replacement for a particularly poor character. This is permission-based, not an automatic reroll.

实现要求：保留“按主持人许可重建”操作与原记录；不能自行规定“总和低于某值就自动重掷”。Classic 的七个职业可依据已核对的职业规则实现调整；Advanced 职业不能沿用一张通用表猜测。[S3、S4]

## 6. AD&D 1E

以下 I–IV 来自 DMG p.11。不得把“3d6 依序”显示为该四种方法之一。[S5]

| 方法与建议标识 | 中文说明 | English description | 玩家操作 |
|---|---|---|---|
| I：四骰去最低 / Method I；`adnd1e.dmg-I` | 六次 4d6，各去一颗最低骰；六个总和自由分配。 | Generate six totals with 4d6, dropping one lowest die each time; assign freely. | 分配六项 |
| II：十二取六 / Method II；`adnd1e.dmg-II` | 掷十二次 3d6，保留最高的六个总和，再自由分配。 | Keep the highest six of twelve 3d6 totals; assign freely. | 分配六项 |
| III：每属性六次取最高 / Method III；`adnd1e.dmg-III` | 每项属性各掷六次 3d6，取该项最高总和；按旧版顺序逐项处理。 | For each ability, keep the highest of six 3d6 totals; use the 1E ability order. | 接受结果 |
| IV：十二套角色选一 / Method IV；`adnd1e.dmg-IV` | 生成十二套依序的六项属性，每项 3d6；选择完整的一套，不能跨套拼接。 | Generate twelve complete in-order 3d6 characters; choose one intact set. | 选一整套 |

不要把 PHB 中关于优秀属性的建议，直接改写为所有方法自动重掷直到达标的强制循环。若实现该建议，须先核对具体裁定并另列选项。

### 6.1 Unearthed Arcana 方法 V / Method V

建议标识：`adnd1e.ua-V`。状态：概要已核对，完整实现待补核。[S6]

**中文说明：**仅用于人类角色。先经主持人同意选择职业，再按职业表为各属性掷指定数量的 d6，保留最高三颗。按该职业规定处理不足最低要求或超出最高限制的结果。原表还包括容貌 Comeliness。

**English:** For human characters only. With DM approval, choose a class, roll its listed dice pool for each ability, and total the highest three dice. Apply the class's required minimums and maximums. The original table also includes Comeliness.

交互：选择职业 → 确认适用限制 → 掷骰 → 显示原始值与规则调整值。

实现前须补核：原版完整骰数表、各职业上下限、容貌调整，以及与职业特殊生成步骤的关系。不能只实现“战士力量 9d6 取三颗”就声称支持整个方法。

资料风险：本轮找到的 1eonline 合并页面包含额外的 `Per` 列及其他混排内容；它不能作为 UA 原表直接录入。必须回到 UA p.74 核对。容貌属于额外字段，不能挤占 CHA。

## 7. AD&D 2E

依据 PHB 第 1 章，Rolling Ability Scores；不同印次页码可能不同。[S7]

| 方法与建议标识 | 中文说明 | English description | 玩家操作 |
|---|---|---|---|
| I：三骰依序 / Method I；`adnd2e.phb-I` | 每项 3d6，按 STR、DEX、CON、INT、WIS、CHA 填入。 | Roll 3d6 in order: STR, DEX, CON, INT, WIS, CHA. | 接受结果 |
| II：每项两次择一 / Method II；`adnd2e.phb-II` | 每项掷两次 3d6，选其中一个总和，属性位置固定。 | For each fixed ability, choose either of two 3d6 totals. | 六次二选一 |
| III：三骰自由分配 / Method III；`adnd2e.phb-III` | 掷六次 3d6，六个总和自由分配。 | Generate six 3d6 totals and assign freely. | 分配六项 |
| IV：十二次任选六个 / Method IV；`adnd2e.phb-IV` | 掷十二次 3d6，选六个总和，再自由分配。 | Choose six of twelve 3d6 totals; assign freely. | 选六个并分配 |
| V：四骰去最低 / Method V；`adnd2e.phb-V` | 六次 4d6，各去一颗最低骰，自由分配总和。 | Generate six 4d6 totals, dropping one lowest die each time; assign freely. | 分配六项 |
| VI：八点基础加七颗骰 / Method VI；`adnd2e.phb-VI` | 六项从 8 开始，掷 7d6，逐颗把完整骰值加到属性上，每项不超过 18。 | Start all abilities at 8. Allocate seven rolled d6 individually; keep each die whole and each score at most 18. | 分配七颗骰 |

II 和 IV 的“取最高”可以是快捷按钮，但不能取消玩家选低值的合法选择。VI 不允许拆骰或把超过 18 的结果截断为 18；每颗骰子需要独立身份，不能重复分配。

后续模块：职业资格、种族调整、卓越力量 18/xx。不要把“任意角色力量为 18”当作自动掷百分骰的条件。

## 8. D&D 3.5

### 8.1 标准随机生成 / Standard random generation

建议标识：`dnd35.phb-roll`。状态：已核对。[S8]

**中文说明：**六次 4d6，每次去掉一颗最低骰，六个总和自由分配。种族调整前，若属性调整值总和不大于 0，或最高属性不大于 13，可以弃用整组重掷。

**English:** Generate six 4d6 totals, dropping one lowest die each time, and assign freely. Before racial adjustments, you may replace the whole set if its modifiers sum to 0 or less, or its highest score is 13 or less.

交互：掷骰 → 显示是否满足重掷资格 → 玩家决定保留或重掷 → 分配。满足条件不是强制重掷；这是“或”条件。

### 8.2 购点 / Point buy

建议标识：`dnd35.dmg-point-buy`。状态：已核对。[S9]

**中文说明：**六项从 8 开始，按 3.5 成本表购买，最高 18。标准预算为 25 点；DMG 另列 15、22、28、32 点预算。

**English:** Start each ability at 8 and buy increases up to 18 using the 3.5 cost table. The standard budget is 25; DMG alternatives are 15, 22, 28, and 32.

标准购点与非标准购点使用同一方法、不同预算。原书类别分别为：15 低强度、22 挑战、28 更艰难、32 高强度；不要把 PF1 的 20/25 档位名称搬过来。

### 8.3 精英数组 / Elite array

建议标识：`dnd35.dmg-elite-array`。状态：已核对。[S9]

**中文说明：**将 15、14、13、12、10、8 分配给六项属性，不掷骰。

**English:** Assign 15, 14, 13, 12, 10, and 8 to the six abilities without rolling.

这是 DMG 的一个选项，不要仅因数值相同就把它命名成 5E 的规则条目。其余五项 DMG 变体见附录，未从目录中遗忘，但不在本轮已锁定的方法实现范围。

## 9. Pathfinder 1E

依据 CRB 的 Generating Ability Scores，Archives of Nethys 正文。[S10]

| 方法与建议标识 | 中文说明 | English description |
|---|---|---|
| 标准 / Standard；`pf1.standard` | 六次 4d6，各去最低一颗；总和自由分配。 | Assign six 4d6 totals, each with one lowest die removed. |
| 经典 / Classic；`pf1.classic` | 六次 3d6，自由分配；原文另允许按掷骰顺序填写。 | Assign six 3d6 totals freely, or use the described in-order option. |
| 英雄 / Heroic；`pf1.heroic` | 每项结果为 2d6+6，共六个，自由分配。 | Generate six totals of 2d6+6 and assign freely. |
| 骰池 / Dice Pool；`pf1.dice-pool` | 掷骰前，把 24 颗 d6 分给六项，每项至少三颗；各项取最高三颗相加。较高强度选项为 28 颗。 | Before rolling, allocate 24 d6 among abilities, at least three each. Keep each ability's highest three dice. The higher-powered option uses 28 dice. |
| 购点 / Purchase；`pf1.purchase` | 六项从 10 开始，按 PF1 表购买或降低返还点数，范围 7–18；预算为 10/15/20/25。 | Start at 10; buy increases or recover points by lowering scores within 7–18. Budgets are 10/15/20/25. |

种族调整在生成之后处理。购点档位分别为 Low / Standard / High / Epic Fantasy；标准为 15 点。你的常用 25 Buy 可以设为个人偏好，但不能修改“官方标准”的文字。

骰池最重要的交互是“先分骰数，再掷骰”，不能让玩家看到结果后重新组合成每项的最高三颗。Classic 的自由分配和依序选项须写入结果记录。

## 10. D&D 5E（2014）

依据官方 Basic Rules，Step-by-Step Characters。[S11]

| 方法与建议标识 | 中文说明 | English description |
|---|---|---|
| 随机生成 / Random generation；`dnd5e2014.roll` | 六次 4d6，各保留最高三颗相加；六个总和自由分配。 | Generate six totals from the highest three of four d6; assign freely. |
| 标准数组 / Standard array；`dnd5e2014.array` | 将 15、14、13、12、10、8 自由分配，不掷骰。 | Freely assign 15, 14, 13, 12, 10, and 8 without rolling. |
| 27 点购点 / 27-point buy；`dnd5e2014.point-buy` | 经主持人允许，按 5E 成本表分配 27 点；各项范围 8–15。 | With DM permission, spend 27 points using the 5E table; each score must be 8–15. |

购点在 2014 文本中标为变体。基础随机方法没有 3.5 那种低值自动获得整组重掷资格的规则；若增加重掷条件，必须标为房规。种族属性增加属于后续步骤，不能混进购点成本计算。Tasha 等扩展另设规则选项。

## 11. D&D 5E（2024）

依据官方 Free Rules，Creating a Character，Step 3。[S12]

| 方法与建议标识 | 中文说明 | English description |
|---|---|---|
| 随机生成 / Random generation；`dnd5e2024.roll` | 六次 4d6，各取最高三颗相加，六个总和自由分配。 | Generate six totals from the highest three of four d6; assign freely. |
| 标准数组 / Standard array；`dnd5e2024.array` | 将 15、14、13、12、10、8 分配给六项属性。 | Assign 15, 14, 13, 12, 10, and 8 to the six abilities. |
| 点数购买 / Point cost；`dnd5e2024.point-buy` | 按成本表购买六项属性，共 27 点；基础值范围 8–15。 | Buy six ability scores with 27 points using the cost table; base scores range from 8 to 15. |

三种方法均在属性生成步骤中列出，主持人可以指定所用方法。算法可与 2014 共用，但游戏标识与说明必须保留。

后续背景调整：从背景指定的三个属性中选择一项 +2、另一项 +1，或三项各 +1；这些增加不能让属性超过 20。首版基础输出应明确写“尚未应用背景调整”，不能把 15 的购点上限误作最终属性上限。

## 12. 三种购点成本表

表内是最终基础属性的总成本，不是从前一级提升的单步成本。破折号表示该方法不允许购买该数值。[S9、S10、S11、S12]

| 基础属性 | D&D 3.5（以 8 为零） | PF1（以 10 为零） | 5E 2014 / 2024（以 8 为零） |
|---:|---:|---:|---:|
| 7 | — | -4 | — |
| 8 | 0 | -2 | 0 |
| 9 | 1 | -1 | 1 |
| 10 | 2 | 0 | 2 |
| 11 | 3 | 1 | 3 |
| 12 | 4 | 2 | 4 |
| 13 | 5 | 3 | 5 |
| 14 | 6 | 5 | 7 |
| 15 | 8 | 7 | 9 |
| 16 | 10 | 10 | — |
| 17 | 13 | 13 | — |
| 18 | 16 | 17 | — |

界面显示预算、已用点数与剩余点数。编辑中允许暂时未花完；何时可确认、是否需要花尽预算，须由方法的完成条件明确规定，不能由前端自行决定。超支始终不能作为合法完成结果。

## 13. 前后端共同遵守的要求

以下是本项目工程要求，不是冒充原书规则。

1. 每个方法有稳定标识、所属游戏、来源、核验状态、中英名称、中英说明、操作步骤和限制。UI 不通过解析中文说明决定规则。
2. 方法选择页直接回答“这是什么方法”；操作页展示本阶段要做什么。说明文字和规则配置由同一核心包提供给网页与未来机器人。
3. 切换语言仅改变文字，不重掷、不重排结果、不清空分配。
4. 相同骰值的骰子、相同总和的候选结果仍有不同编号，避免选择/拖动时误删另一项。
5. 原始骰子、保留/舍弃、玩家选择、规则调整、主持人许可重建分别记录。撤销分配不产生新随机数。
6. 不允许跨组拼接 AD&D 1E IV；不允许拆分 AD&D 2E VI 的单颗骰子；不允许 PF1 骰池事后分骰。
7. 官方规则、官方可选规则、主持人裁定、用户房规分开标记。算法相同不代表完整规则相同。
8. 基础结果至少导出：游戏与方法、选项、属性映射、骰子明细、操作记录、是否尚有后续调整，以及本次规则资料版本。
9. 低属性允许重掷时由用户选择，不在后台循环到“漂亮结果”。本地记录只用于解释过程，不宣称可防篡改。
10. 中文页面保留英文方法名；提供中/英说明切换。不能只显示 `4d6kh3` 之类的骰式。

## 14. 必须覆盖的验收例子

这些例子用于锁定易错行为，完整测试需在引擎实现时补充。

| 测试 | 应有结果 |
|---|---|
| 4d6 得到 1、1、5、6 | 只丢一颗 1，总和 12 |
| 依序方法的第一项低、最后一项高 | 不可自动排序改善角色 |
| AD&D 1E II 与 2E IV 使用同一组十二个总和 | 1E 保留最高六个；2E 允许玩家选择六个，包括较低值 |
| AD&D 2E II，某项候选为 8 与 14 | 允许玩家选择 8；快捷“取高”可选择 14 |
| AD&D 1E IV | 只能选择十二套中的完整一套 |
| AD&D 2E VI，属性已为 14，分配一颗 5 | 拒绝，不能变成 18，也不能拆成 4+1 |
| PF1 骰池，某项只分配两颗骰 | 不允许开始正式掷骰 |
| 3.5 基础属性 13、13、13、13、13、13 | 最高只有 13，因此有整组重掷资格，即使调整值总和为正 |
| 3.5 基础属性 14、10、10、10、8、8 | 调整值总和为 0，因此有整组重掷资格 |
| 5E 同样得到上两组属性 | 不自动继承 3.5 的重掷资格 |
| OSE 盗贼尝试降低 STR 换 DEX | 拒绝该交换 |
| 购买基础属性 14 | 3.5 成本 6；PF1 成本 5；5E 成本 7 |
| 5E 15、15、15、8、8、8 | 恰好 27 点 |
| UI 从中文切为英文 | 骰子与玩家分配完全不变 |

## 15. 已发现但未锁定实现的扩展目录

### 15.1 D&D 3.5 DMG 的其他五项方法

原书 pp.169–170 除购点两项与精英数组外，还列以下五项。这里保留目录与简短说明；在加入可运行方法前，须逐项补核步骤时机与重掷条件，不能只根据摘要实现。[S9、S13]

| 名称 | 简短中英说明 | 尚待核准 |
|---|---|---|
| 浮动重掷 / The Floating Reroll | 标准掷骰过程中使用一次最低骰重掷机会。 / One opportunity to reroll a lowest die during generation. | 决策时机、替换与弃骰顺序 |
| 自然生成角色 / Organic Characters | 依序生成后，有限度重掷及交换。 / In-order generation with limited rerolling and swapping. | 阶段顺序及完整完成条件 |
| 自定义普通角色 / Customized Average Characters | 三骰结果可自由分配。 / Freely assigned 3d6 results. | 该变体专属重掷阈值 |
| 随机普通角色 / Random Average Characters | 三骰结果按固定属性顺序填写。 / In-order 3d6 results. | 该变体专属重掷阈值 |
| 高强度角色 / High-Powered Characters | 每次五颗骰保留三颗。 / Keep three dice from each five-die roll. | 保留规则及该变体重掷阈值 |

### 15.2 AD&D 2E Player's Option: Skills & Powers

此次约定范围是 PHB I–VI。Skills & Powers 的额外生成法、购点与子属性可以作为独立扩展批次；不以“PHB 方法”名义混入。若加入，应先核验全套方法与费用表，再决定是否只输出六项基础属性，或继续处理十二项子属性。

### 15.3 下一步的具体工作

先把第 1 节已核对的方法转成机器可读目录与固定输入测试，并补核 UA V 及 B/X 的上述边界。核心接口必须能表达固定顺序、自由分配、候选选择、整套选择、逐骰分配、掷前骰池分配和购点。随后交付可运行核心包、调用示例与前端提示词，再交给 Claude。

人类只需决定：是否增加尚未约定的扩展，以及说明风格是否合用。规则表录入、技术接口和测试不应转嫁给人类手工处理。

## 16. 来源记录

本轮查阅日期均为 2026-10-17。原书扫描/转录的出版机构与承载网页的机构不是一回事；镜像不标作出版社官网。网页可能混入编辑内容，因此有疑点的表格保持待核状态。

- **S1** — Dungeons & Dragons, Vol. 1: Men & Magic（1974），pp.10–11，Determination of Abilities / Explanation of Abilities。[原书重印文本转录](https://anyflip.com/oahjl/yacw/basic)。本轮用于基础顺序与经验换算边界，不对争议性换算写死公式。
- **S2** — Dungeons & Dragons Basic Rulebook，Tom Moldvay（1981），角色生成及 Ability Score Adjustments，尤其 p.B6。[原书扫描索引](https://www.americanroads.us/DandD/DnD_Basic_Rules_Moldvay.pdf)。取得检索文本；未在本轮完成逐页视觉核验。
- **S3** — Old-School Essentials SRD，Player Characters / Creating a Character。[SRD 镜像](https://osesrd.opengamingnetwork.com/player-characters/)。另见出版社的[建卡实例](https://necroticgnome.com/blogs/news/old-school-essentials-character-creation-example)。
- **S4** — Old-School Essentials Basic Rules v1.4，Thief，Adjust ability scores。[原书文本转录](https://studylib.net/doc/27500729/old-school-essentials---basic-rules-v1-4)。用于盗贼不能降低力量的限制。
- **S5** — AD&D Dungeon Masters Guide（1979），p.11，方法 I–IV；Dragon 的 Let the Good Dice Roll 复述了四种方法。[文章转录](https://1eonline.info/d/dice.odds.htm)。该页复述用于方法核对；正式数据库仍应记录 DMG 为规则出处。
- **S6** — AD&D Unearthed Arcana（1985），p.74，Method V。[原书扫描索引](https://donperkins.net/dnd/books/Unearthed_Arcana.pdf)；[原书文本转录](https://dokumen.pub/official-advanced-dungeons-dragons-unearthed-arcana-a-compendium-of-new-ideas-and-new-discoveries-for-add-game-campaigns-of-benefit-to-players-and-dungeon-masters-alike.html)。[合并转录页](https://1eonline.info/3dmg/goas.htm)含混入内容，不能直接当原表。
- **S7** — AD&D 2E Player's Handbook，Chapter 1，Rolling Ability Scores。[PHB 文本转录](https://adnd2e.fandom.com/wiki/Rolling_Ability_Scores_(PHB))。保留 II/IV 的选择自由，不将转述中的“通常取最高”改为强制规则。
- **S8** — D&D 3.5 Player's Handbook，Ability Scores / Rerolling，pp.7–8。[原书文本转录](https://studylib.net/doc/18263338/3.5-player-s-handbook)。
- **S9** — D&D 3.5 Dungeon Master's Guide，pp.169–170，Ability Scores。[原书文本检索页面](https://anyflip.com/smqdp/kmty/basic/151-200)。本轮可取得索引摘录，完整页面打开受限；其他变体的详细行为保留待核。
- **S10** — Pathfinder RPG Core Rulebook，Getting Started / Generating Ability Scores。[Archives of Nethys](https://legacy.aonprd.com/corerulebook/gettingStarted.html)。
- **S11** — D&D Basic Rules（2014），Step-by-Step Characters，Determine Ability Scores / Variant: Customizing Ability Scores。[官方规则](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters)。
- **S12** — D&D Free Rules（2024），Creating a Character，Step 3: Determine Ability Scores。[官方规则](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character)。
- **S13** — D&D Lore Wiki，Ability score，第三版方法目录。[辅助目录](https://dungeonsdragons.fandom.com/wiki/Ability_score)。仅用于发现未列尽的 DMG 变体，不单独作为实现依据。

版本结论：这是一份可审阅的规则与文案清单。已核对项目可以进入实现设计；待补核项目不应以完整官方支持的状态交付。
