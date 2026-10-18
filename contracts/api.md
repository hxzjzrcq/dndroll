# DNDROLL 当前 API 合同

适用于应用／Core v0.4.0。本文描述当前行为；版本沿革见 [CHANGELOG](../CHANGELOG.md)，发布验收见 [验证记录](../docs/validation.md)。后续修改应直接更新相应章节，不追加“某节覆盖前文”的版本补丁。

## 权威来源与包边界

| 内容 | 权威来源 | 维护方式 |
|---|---|---|
| 函数签名和公共类型 | [Core 入口](../packages/core/src/index.ts)、[类型定义](../packages/core/src/types.ts)及构建后的声明 | [contracts/types.ts](types.ts) 直接引用，不另写一套类型 |
| 游戏方法、选项、映射和合法样例 | 实际 Core | `npm run fixtures` 生成 [catalog.json](catalog.json) 和 [examples.json](examples.json) |
| 行为含义、适用边界和兼容承诺 | 本文 | 根据实际代码和测试人工维护 |

UI／适配器从 `@dndroll/core` 包入口导入，不复制规则算法、不修改内部状态、不自行猜测事件含义。Core 不依赖 React、DOM、浏览器存储或平台专属 API。`apps/web` 通过 npm workspace 使用本地 Core 包。

公共输出深度冻结。`applyAction` 返回新的不可变 Session，不修改输入。随机数只在明确动作中消耗；读取 View、切换语言／主题、浏览或恢复已有 Session 不应产生新骰值。

## 公共接口

| 接口 | 当前行为 |
|---|---|
| `listVersions()` | 十个游戏入口，含双语名称与内部属性顺序 |
| `listMethods(versionId)` / `getMethod(methodId)` | 读取方法定义；目录含 pending，创建时拒绝 pending |
| `createSession(request)` | 校验版本、方法和选项；不掷骰；固定数组和非随机预算购点直接进入编辑 |
| `applyAction(session, action, rng?)` | 重放、校验并执行动作；可能按规则追加独立的传奇力量事件 |
| `getSessionView(session)` | 从事件日志重建当前 View，不产生随机数 |
| `validateSession(session)` | 返回 `{valid,complete,issues}`；valid 指当前没有 error，complete 指已经 finalize；未分配完成时 valid 可以为 false |
| `serializeSession(session)` | 校验后生成用于恢复的 Session JSON 字符串 |
| `deserializeSession(json)` | 校验版本／格式并重放；拒绝非法动作、多余／缺失或超出骰面的记录 |
| `exportResult(session)` | 仅完成后可用；返回分数、原生映射、全部尝试、来源和完整 Session |
| `formatResult(session, locale?)` | 仅完成后可用；默认 zh，支持 zh/en；方括号骰值表示弃骰，DCC 附专用调整值 |
| `cryptoRng(sides)` | 安全整数随机源，使用 getRandomValues 和拒绝采样，无 Math.random 降级 |
| `sequenceRng(values)` | 固定骰序列；耗尽或数值无效时报错，仅用于测试／明确标示的示例 |
| `isRandomMethod(method)` | 快速“再掷一组”的方法资格；含随机预算方法 IX，不等于批量资格 |
| `formatAbilityScore(ability, score, percent?)` | undefined 显示破折号；STR 18 搭配百分比时显示 18/xx，100 显示 00；资格判定由 Core 流程负责 |
| `getAbilityDisplay` / `getAbilityMapping` / `toNativeScores` | 版本属性映射，见下文 |
| `dccAbilityModifier(score)` | DCC 专用调整值，见下文 |
| `isBatchMethod` / `generateBatch` | 独立批量调度，见下文 |

`RULES_VERSION`、`ABILITIES`、`BATCH_COUNTS`、`MAX_BATCH_SIZE` 为公共常量。`RuleError` 与 `BatchGenerationError` 提供稳定代码及双语 messages。

## Session 生命周期与随机源

Session 保存 `schemaVersion`、`rulesVersion`、`request`、`events[]`。每条事件为 `{action,dice}`；dice 保留执行该动作实际消耗的骰值。更改生成方法或掷前选项意味着创建新 Session，UI 应确认是否放弃当前已有进度。

常规流程是 create → 配置（如需要）→ roll（随机方法）→ 玩家选择／调整（如需要）→ finalize。购点与固定数组不必 roll。finalize 后不能继续修改；新建或“再掷一组”是新的独立生成。规则允许的 reroll 则在同一 Session 中保留前次尝试。

可注入同步 `Rng = (sides:number) => number`。失败不修改输入 Session，但外部 RNG 已消耗的部分不能回滚。一次 `applyAction` 可能追加多个事件，调用方不能假定一调用必然对应一条事件。禁止在 React render、state updater 或初始化 effect 中投骰。

```ts
import { createSession, applyAction, formatResult, generateBatch } from '@dndroll/core';

let session = createSession({versionId:'dcc', methodId:'dcc.3d6-in-order'});
session = applyAction(session, {type:'roll'});
session = applyAction(session, {type:'finalize'});
const text = formatResult(session, 'zh');
const batch = generateBatch({versionId:'dcc', methodId:'dcc.3d6-in-order'}, 4);
```

## 掷前选项

| 方法 | 选项与默认值 |
|---|---|
| 3.5 购点 | budget: 15/22/25/28/32，默认 25 |
| PF1 购点 | budget: 10/15/20/25，默认 15；UI 可以另存上次预算偏好 |
| 5E 购点 | budget: 27 |
| 2E VII／X | budget: 75；必须分配全部属性点 |
| 2E IX | 不接受 budget；先 roll 两颗 d6，按表得到预算及单项上限 |
| PF1 Classic | inOrder: true/false，默认 false |
| PF1 骰池 | poolTotal: 24/28，默认 24 |
| 2E VIII | poolTotal: 24 |

字段可省略时使用 Core 默认值；不适用的选项和未列出的值会被拒绝。精确参数以方法元数据为准，不在 UI 另造成本表或限制。

## Action 与约束

| Action | 当前行为 |
|---|---|
| `roll` | 当前尝试仅可生成一次；2E IX 用于产生预算 |
| `setPool {counts}` | 掷前提交六槽完整骰数；总数恰好用完，每项下限 3；2E VIII 每项上限 6，PF1 按方法范围校验 |
| `assign {assignments}` | 适用的自由分配／数组方法；完整替换当前映射，可为空或部分映射，同一候选不能重复使用；依序模式不可自由分配 |
| `choosePair {ability,candidateId}` | 2E II 在该属性的两个候选中任选，包括较低者 |
| `chooseSet {setId}` | 1E IV 选完整一套，不能跨套拼接 |
| `allocateDie {dieId,ability}` | 2E VI 移动整颗骰；ability:null 撤回；单项不能超过 18 |
| `setScore {ability,score}` | 购点编辑；允许暂时超支，但超支不能完成 |
| `rollExceptional` | 1E/2E STR 18、非方法 X、该组尚无百分比时投一次 d100 |
| `buyExceptional {percent}` | 仅 2E X 的 STR 18；percent 为 0/10/…/100；0 表示普通 18 |
| `selectClass {classId}` | 仅 B/X/OSE 七职业，null 清除；选择／改职业重置本次交换，由 Core 检查最低属性 |
| `trade {from,to}` | 仅 B/X/OSE，按职业限制执行 -2/+1；供出不低于 9、目标不超过 18 |
| `resetAdjustments` | 仅 B/X/OSE，撤销本次交换，保留职业和事件 |
| `reroll {reason:'rule'}` | 仅符合条件的 3.5 方法；记录前次尝试 |
| `reroll {reason:'referee',note}` | 仅 B/X/OSE，必须记录主持人许可说明；不是身份认证 |
| `finalize {acceptUnspent?}` | 通过 Core 检查后锁定；一般购点余点需 acceptUnspent:true；2E VII/IX/X 余点是 error，不能用确认绕过 |

准确的可辨识联合类型见 `types.ts`，表中省略外层 `{type:...}`。没有通用任意改值、撤销随机骰、自动无限重掷或房规编辑动作。

### 传奇力量与随机预算

1E/2E 非 buy 方法在真实 STR 达到 18 时自动追加独立 `rollExceptional` 事件。VII/IX 点击投骰，X 购买。未分配给 STR 的候选 18 不触发。一个掷骰组只投一次；STR 暂移离 18 后保留百分比，返回时复用。X 降低 STR 会清除购买并退还对应点数。资格与上限按项目约定不检查职业、种族和性别，界面／导出有提示。DCC 不触发传奇力量。

`attempt.exceptionalStrength` 保存本组百分比，`SessionView.exceptionalStrength` 给出 value、mode、canRoll、canPurchase；当前 STR 非 18 时该 View 字段为 null。整数 STR 与百分比分开保存。X 每额外一点购买 10%，费用计入同一预算。

2E IX 的 `attempt.pointGeneration` 保存两颗预算骰、预算与单项上限；`Method.randomBudget` 标识这种 buy 方法。规则表在 Core，UI 不重新计算。

## View 与显示端职责

`phase` 为 configure、roll、assign、choose-pairs、choose-set、allocate-dice、point-buy、review、complete。review 仍可能允许调整，不能当作完成。`allowedActions` 只说明动作种类存在，不保证任意参数都合法；例如未配满骰池时 roll 仍会失败。按钮可参考 canFinalize／canRuleReroll／canRefereeReroll，最终合法性仍由 Core 判断。

`attempt` 包含候选及每颗骰的 id/value/kept、单颗骰、映射、整套选择、分配、基础／当前属性、职业、交换和骰池配置；`previousAttempts` 保留前次尝试。1E II 的 eligible 是第六高的门槛，同分可超过六个 eligible，最终仍须保留数值最高六个，不能仅据 eligible 任取六个。

`pointBuy` 给出 budget/spent/remaining/costs，数值范围取 costs 的键。一般余点是 warning，超支是 error；2E VII/IX/X 余点是 error。`classOptions` 仅在适用版本提供七职业；更改职业会清除调整。

方法名称／说明／notes、版本名称、notices、issues.message 均提供 zh/en。source 保留规则出处；不要改写成另一套规则。语言属于 UI 偏好，不进入规则事件。恢复／切换语言或主题不得投新骰。

## 属性映射与 DCC 调整值

内部 Ability 固定为 STR/DEX/CON/INT/WIS/CHA。名称与对外缩写由 `getAbilityDisplay(versionId,slot)` 返回冻结的 `{slot,id,name:{zh,en}}`；`getAbilityMapping(versionId)` 按该版本实际属性顺序返回六个描述符；`toNativeScores(versionId,partialScores)` 映射已存在的数值，不补值。

2E 中文 WIS 全称为灵知；其他原有版本仍为感知，英文均为 Wisdom。DCC 映射如下：

| 内部槽位（依 DCC 掷骰顺序） | 对外属性 | 中文 |
|---|---|---|
| STR | STR / Strength | 力量 |
| DEX | AGI / Agility | 敏捷 |
| CON | STA / Stamina | 耐力 |
| WIS | PER / Personality | 人格 |
| INT | INT / Intelligence | 智力 |
| CHA | LCK / Luck | 幸运 |

`dcc.3d6-in-order` 每项 3d6、全保留、不交换；单次日志正好 18 个 d6。只生成六属性及调整值，不是完整零级人物卡。来源及译名说明见 [DCC 说明](../docs/rules/dcc-v0.4.md)。

`dccAbilityModifier(score)`：3→−3，4–5→−2，6–8→−1，9–12→0，13–15→+1，16–17→+2，18→+3；不是 D20 公式。非整数／超出 3–18 抛 RangeError。映射帮助函数对未知版本／槽位也抛 RangeError。

`NativeAbility` 是内部 Ability 与 AGI/STA/PER/LCK 的联合；`NativeScores` 是原生键的部分记录，完整结果有当前版本的六个键，不是联合中的十个键同时存在。UI、历史、TXT／复制必须用该版本真实缩写；原始 Session 审计数据可使用内部槽位。

## 导出与持久化

| 格式／接口 | 用途 |
|---|---|
| `serializeSession` 的 JSON | 可恢复的原始会话，交给 deserializeSession；UI 自动存档也采用它 |
| `exportResult` 的对象／JSON | 完成后的完整结果报告，含内嵌 session；不能把整个报告直接当成 Session 导入 |
| `formatResult` 的 TXT／复制文本 | 供人阅读，不是存档输入格式 |

结果包括 versionId/methodId/options、内部 baseScores/adjustedScores、exceptionalStrength、selectedClass、source、scope、notices、attempts 和 session，并提供：

| 字段 | 含义 |
|---|---|
| abilityMapping | 按版本顺序的六个属性描述符 |
| nativeBaseScores | 对外原生键的基础属性 |
| nativeScores | 对外原生键的最终属性 |
| nativeModifiers | DCC 专用调整值；其他版本为 null |

内部 baseScores/adjustedScores/attempts/session 必须结合 versionId 和映射解释，不能把 CHA 当作 DCC Luck 的真实名称。TXT 使用原生缩写，DCC 附调整值。目录样例带 abilityMapping；examples 包括 dcc-review、dcc-complete（含 result）、dcc-batch-4（独立 session/view/result）。

损坏存档应报告错误，不能因初始化自动删除；用户可明确清除。`file://` 剪贴板失败时提供可选中文本和 TXT 下载。单人当前会话自动保存；十组历史和批量结果分别在内存中保存，刷新／关闭后清空。

<a id="save-policy"></a>

## 存档与兼容政策

本节是存档兼容承诺的唯一正式入口；其他文档只引用，不另行规定。

**承诺：保证当前 v0.4 Session 的序列化／反序列化和事件重放；不承诺旧版 JSON 向后兼容，也不为后续版本预先作兼容保证。**

当前代码的版本判定如下，均仍需通过请求、事件和骰值校验：

| 输入 | 当前实现 |
|---|---|
| schemaVersion | 仅接受 1 |
| rulesVersion=`0.4.0-2026-10-18` | 当前规则版本，接受并重放 |
| rulesVersion=`0.1.0-2026-10-17` | 遗留代码仍接受；不因此扩大兼容承诺；保留已有日志，不在读取时补骰 |
| rulesVersion=`0.2.0-2026-10-17` | 拒绝，SCHEMA_VERSION |
| 其他 rulesVersion | 拒绝；v0.3 应用沿用上述 v0.2 规则版本，其原始存档同样被拒绝 |

遗留 v0.1 的首次成功 applyAction 会写入当前 RULES_VERSION，并按适用条件记录真实百分骰；已 finalize 的 Session 仍不可修改。这是保留实现的说明，不是要求后续版本继续支持它。没有通用的 v0.2/v0.3 迁移接口。

schemaVersion 描述存档结构，rulesVersion 描述规则解释版本，应用版本不等于这两个字段。Session 校验／重放能发现格式和规则错误，不是防伪签名。

## 通用批量调度

`isBatchMethod(method,options?)` 判定适用性；`generateBatch(request,count,rng?)` 返回深冻结的 `BatchEntry[]`，每项为 `{index,session,view}`，index 从 1 开始。数量为 1–8 整数，MAX_BATCH_SIZE=8；UI 用 BATCH_COUNTS=[1,2,4,8]，默认 4。这是工具预设，不是 DCC 人数规则。

允许 DCC、OD&D、2E I、1E III，以及明确 inOrder:true 的 PF1 Classic。B/X/OSE 保留可选职业及主属性调整，本版不批量；其他仍需选择的 assign/pairs/sets/allocate/pool/buy/array/pending 方法不自动完成。

调度器按同一同步 RNG 流逐组 createSession → roll → finalize → getSessionView，复用原规则与传奇力量流程。各组独立事件日志和状态，不共享可变 Session，不合并日志，不自动替玩家分配或择优。

数量非法为 BATCH_COUNT，方法不适用为 BATCH_UNSUPPORTED；非法 request 使用原会话校验错误。第 N 组执行失败抛 BatchGenerationError（code=BATCH_GROUP_FAILED、group=N、causeCode、cause、双语 messages），不返回部分批量；已消耗的外部 RNG 无法回滚。

每个子 Session 复用原序列化、重放、校验与导出。Web 查看／复制／下载不写单人 store 或历史，只有明确设为当前会话才进入原确认／自动保存流程。再次生成替换批量；失败时 UI 明确保留上次成功结果。没有批量整体 ZIP 格式。

## 错误与限制

业务错误通常抛 RuleError（code、messages.zh/en）；BatchGenerationError 是其子类。validateSession 会将 RuleError 转成 valid:false 和 issues，不保证吞掉任意外部异常。映射和 DCC 数值帮助函数使用 RangeError；注入 RNG 的其他异常也可能向外传播或被批量包装。

Session 最多 2048 个事件；单事件骰值最多 216 项；deserializeSession 文本最多 2,000,000 字符。每条记录按动作实际骰面验证，不能用 d100 值伪装 d6。更多精确类型见 Core 声明，规则来源和待核准项见目录与 docs/rules。
