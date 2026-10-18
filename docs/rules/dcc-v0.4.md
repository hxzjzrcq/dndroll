# DCC v0.4 规则来源与显示映射

本版按任务书指定范围实现 Goodman Games《Dungeon Crawl Classics RPG Quick Start Guide》（June 2011），p.2 “Ability Scores” 与 “Table 1-1: Ability Score Modifiers”。官方来源：<https://www.goodman-games.com/downloads/DCCRPGQuickStartGuide060811.pdf>。2026-10-18 已通过该官方 PDF 的检索文本核对顺序及调整值；PDF 直接打开返回 403，未假称完成本地整本 PDF 校读。

顺序为 Strength、Agility、Stamina、Personality、Intelligence、Luck。每项依序投 3d6，保留全部，不重排、不购点。本版只输出六属性及调整值；不生成职业、出身、生命值、装备、钱币、幸运征兆，不声称是完整零级人物卡。

| 对外属性 | 中文执行默认值 | 内部槽位 |
|---|---|---|
| STR / Strength | 力量 | STR |
| AGI / Agility | 敏捷 | DEX |
| STA / Stamina | 耐力 | CON |
| PER / Personality | 人格 | WIS |
| INT / Intelligence | 智力 | INT |
| LCK / Luck | 幸运 | CHA |

中央定义位于 `packages/core/src/ability-display.ts`；中文为本任务的暂定译名，后续只需集中修改。`catalog.ts` 的 DCC 内部掷骰顺序是 STR, DEX, CON, WIS, INT, CHA。其他版本各自顺序不变；2E WIS 中文仍为灵知，其他 D&D/PF1/OSE 为感知。Core 和 Web 共用这份映射。

| 属性值 | 调整值 |
|---|---:|
| 3 | -3 |
| 4–5 | -2 |
| 6–8 | -1 |
| 9–12 | 0 |
| 13–15 | +1 |
| 16–17 | +2 |
| 18 | +3 |

`dccAbilityModifier()` 是独立纯函数，不使用 D20 调整值公式。所有 3–18 值及非法输入均已测试。与任务书给定表无差异。

固定序列验收：1,1,1 / 6,6,6 / 2,2,2 / 5,5,5 / 3,3,3 / 4,4,4 → STR 3(-3), AGI 18(+3), STA 6(-1), PER 15(+1), INT 9(0), LCK 12(0)。Session 保留 18 个原始 d6 与内部槽位；结果 JSON 附原生分数、调整值和映射；页面／历史／TXT 不把内部伪标签展示为 DCC 属性名。

默认批量 4，数量预设 1/2/4/8 是工具选择，不作为 DCC 规则陈述。批量可适用的方法与错误行为详见 `contracts/api.md`。
