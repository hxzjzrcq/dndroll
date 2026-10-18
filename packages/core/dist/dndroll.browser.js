"use strict";
var DndRoll = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/core/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    ABILITIES: () => ABILITIES,
    BATCH_COUNTS: () => BATCH_COUNTS,
    BatchGenerationError: () => BatchGenerationError,
    MAX_BATCH_SIZE: () => MAX_BATCH_SIZE,
    RULES_VERSION: () => RULES_VERSION,
    RuleError: () => RuleError,
    applyAction: () => applyAction,
    createSession: () => createSession,
    cryptoRng: () => cryptoRng,
    dccAbilityModifier: () => dccAbilityModifier,
    deserializeSession: () => deserializeSession,
    exportResult: () => exportResult,
    formatAbilityScore: () => formatAbilityScore,
    formatResult: () => formatResult,
    generateBatch: () => generateBatch,
    getAbilityDisplay: () => getAbilityDisplay,
    getAbilityMapping: () => getAbilityMapping,
    getMethod: () => getMethod,
    getSessionView: () => getSessionView,
    isBatchMethod: () => isBatchMethod,
    isRandomMethod: () => isRandomMethod,
    listMethods: () => listMethods,
    listVersions: () => listVersions,
    sequenceRng: () => sequenceRng,
    serializeSession: () => serializeSession,
    toNativeScores: () => toNativeScores,
    validateSession: () => validateSession
  });

  // packages/core/src/catalog.ts
  var RULES_VERSION = "0.4.0-2026-10-18";
  var ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  var OLD_ORDER = ["STR", "INT", "WIS", "DEX", "CON", "CHA"];
  var text = (zh, en) => ({ zh, en });
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      Object.values(value).forEach(freeze);
    }
    return value;
  }
  var versions = freeze([
    { id: "odnd1974", name: text("OD&D\uFF081974\uFF09", "OD&D (1974)"), order: ["STR", "INT", "WIS", "CON", "DEX", "CHA"] },
    { id: "bx1981", name: text("B/X D&D\uFF081981\uFF09", "B/X D&D (1981)"), order: [...OLD_ORDER] },
    { id: "ose-classic", name: text("OSE \u2014 \u7ECF\u5178\u5947\u5E7B", "OSE \u2014 Classic Fantasy"), order: [...OLD_ORDER] },
    { id: "adnd1e", name: text("AD&D \u7B2C\u4E00\u7248", "AD&D 1E"), order: [...OLD_ORDER] },
    { id: "adnd2e", name: text("AD&D \u7B2C\u4E8C\u7248", "AD&D 2E"), order: [...ABILITIES] },
    { id: "dnd35", name: text("D&D 3.5", "D&D 3.5"), order: [...ABILITIES] },
    { id: "pf1", name: text("Pathfinder \u7B2C\u4E00\u7248", "Pathfinder 1E"), order: [...ABILITIES] },
    { id: "dnd5e2014", name: text("D&D 5E\uFF082014\uFF09", "D&D 5E (2014)"), order: [...ABILITIES] },
    { id: "dcc", name: text("Dungeon Crawl Classics\uFF08DCC\uFF09", "Dungeon Crawl Classics (DCC)"), order: ["STR", "DEX", "CON", "WIS", "INT", "CHA"] },
    { id: "dnd5e2024", name: text("D&D 5E\uFF082024\uFF09", "D&D 5E (2024)"), order: [...ABILITIES] }
  ]);
  var source = (title, location, url, evidence = "transcription") => ({ title, location, url, evidence });
  var sources = {
    dcc: source("Dungeon Crawl Classics RPG Quick Start Guide (June 2011)", "p.2, Ability Scores / Table 1-1", "https://www.goodman-games.com/downloads/DCCRPGQuickStartGuide060811.pdf", "official-web"),
    odnd1974: source("Men & Magic (1974)", "pp.10\u201311", "https://anyflip.com/oahjl/yacw/basic"),
    bx1981: source("Moldvay Basic (1981)", "pp.B5\u2013B6, B13", "https://www.americanroads.us/DandD/DnD_Basic_Rules_Moldvay.pdf", "indexed-original"),
    "ose-classic": source("OSE Classic / Basic Rules", "Creating a Character; Thief", "https://osesrd.opengamingnetwork.com/player-characters/"),
    adnd1e: source("AD&D 1E Dungeon Masters Guide", "p.11; reproduced in Dragon, Let the Good Dice Roll", "https://1eonline.info/d/dice.odds.htm"),
    adnd2e: source("AD&D 2E Player\u2019s Handbook", "Chapter 1: Rolling Ability Scores", "https://adnd2e.fandom.com/wiki/Rolling_Ability_Scores_(PHB)"),
    dnd35: source("D&D 3.5 Player\u2019s Handbook", "pp.7\u20138, Ability Scores / Rerolling", "https://studylib.net/doc/18263338/3.5-player-s-handbook"),
    pf1: source("Pathfinder Core Rulebook", "Generating Ability Scores", "https://legacy.aonprd.com/corerulebook/gettingStarted.html", "official-web"),
    dnd5e2014: source("D&D Basic Rules (2014)", "Determine Ability Scores", "https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters", "official-web"),
    dnd5e2024: source("D&D Free Rules (2024)", "Step 3: Determine Ability Scores", "https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character", "official-web")
  };
  var dmg35 = source("D&D 3.5 Dungeon Master\u2019s Guide", "pp.169\u2013170", "https://anyflip.com/smqdp/kmty/basic/151-200", "indexed-original");
  var costs35 = { "8": 0, "9": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 6, "15": 8, "16": 10, "17": 13, "18": 16 };
  var costsPF = { "7": -4, "8": -2, "9": -1, "10": 0, "11": 1, "12": 2, "13": 3, "14": 5, "15": 7, "16": 10, "17": 13, "18": 17 };
  var costs5 = { "8": 0, "9": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 7, "15": 9 };
  var result = [];
  function add(versionId, suffix, name, description, mode, extra = {}) {
    result.push({
      id: `${versionId}.${suffix}`,
      versionId,
      name,
      description,
      mode,
      source: sources[versionId],
      status: "ready",
      category: "official-option",
      notes: [],
      diceCount: 3,
      keep: 3,
      bonus: 0,
      budgets: [],
      defaultBudget: null,
      costs: {},
      base: 8,
      canChooseOrder: false,
      poolTotals: [],
      ...extra
    });
  }
  add("dcc", "3d6-in-order", text("3d6 \u987A\u5E8F\u751F\u6210", "3d6 in order"), text("\u6309 STR\uFF08\u529B\u91CF\uFF09\u3001AGI\uFF08\u654F\u6377\uFF09\u3001STA\uFF08\u8010\u529B\uFF09\u3001PER\uFF08\u4EBA\u683C\uFF09\u3001INT\uFF08\u667A\u529B\uFF09\u3001LCK\uFF08\u5E78\u8FD0\uFF09\u4F9D\u6B21\u5404\u63B7 3d6\uFF0C\u4FDD\u7559\u5168\u90E8\u9AB0\u5B50\uFF0C\u4E0D\u4EA4\u6362\u7ED3\u679C\u3002\u4EC5\u751F\u6210\u516D\u5C5E\u6027\u53CA\u8C03\u6574\u503C\uFF0C\u4E0D\u662F\u5B8C\u6574\u96F6\u7EA7\u4EBA\u7269\u5361\u3002", "Roll 3d6 in order for STR (Strength), AGI (Agility), STA (Stamina), PER (Personality), INT (Intelligence), LCK (Luck). Keep all dice; no swapping. Generates abilities and modifiers only, not a complete level-0 character."), "fixed", { category: "standard", notes: [text("\u4E0D\u751F\u6210\u804C\u4E1A\u3001\u51FA\u8EAB\u3001\u751F\u547D\u503C\u3001\u94B1\u5E01\u3001\u88C5\u5907\u6216\u5E78\u8FD0\u5F81\u5146\u3002", "Does not generate class, occupation, hit points, money, equipment or birth augur.")] });
  add("odnd1974", "3d6-in-order", text("\u4E09\u9AB0\u4F9D\u5E8F", "3d6 in order"), text("\u4F9D\u6B21\u4E3A STR\u3001INT\u3001WIS\u3001CON\u3001DEX\u3001CHA \u5404\u63B7 3d6\uFF0C\u7ED3\u679C\u56FA\u5B9A\u3002\u539F\u59CB\u6D41\u7A0B\u7531\u4E3B\u6301\u4EBA\u63B7\u9AB0\u3002", "Roll 3d6 for STR, INT, WIS, CON, DEX, CHA, in that order. The original procedure has the referee roll."), "fixed", { category: "standard", notes: [text("\u4EC5\u751F\u6210\u516D\u9879\u57FA\u7840\u5C5E\u6027\uFF1B\u4E3B\u5C5E\u6027\u7ECF\u9A8C\u6362\u7B97\u5C1A\u672A\u5E94\u7528\u3002", "Generates the six base scores only; prime-requisite XP conversion is not applied.")] });
  for (const v of ["bx1981", "ose-classic"]) add(v, "3d6-in-order", text("\u4E09\u9AB0\u4F9D\u5E8F", "3d6 in order"), text("\u6309 STR\u3001INT\u3001WIS\u3001DEX\u3001CON\u3001CHA \u5404\u63B7 3d6\u3002\u4E4B\u540E\u53EF\u9009\u804C\u4E1A\u5E76\u6309\u5176\u9650\u5236\u8C03\u6574\u4E3B\u5C5E\u6027\u3002", "Roll 3d6 for STR, INT, WIS, DEX, CON, CHA in order. You may then choose a class and make its permitted prime-requisite exchanges."), "fixed", { category: "standard", notes: [text("\u6BCF\u6B21\u4ECE\u5141\u8BB8\u7684\u5C5E\u6027\u51CF 2 \u6362\u4E3B\u5C5E\u6027\u52A0 1\uFF1B\u4F9B\u51FA\u5C5E\u6027\u4E0D\u4F4E\u4E8E 9\uFF0C\u76EE\u6807\u4E0D\u8D85\u8FC7 18\u3002\u76D7\u8D3C\u4E0D\u80FD\u964D\u4F4E STR\u3002", "Trade 2 eligible donor points for 1 prime-requisite point; donor minimum 9, target maximum 18. Thieves cannot lower STR."), text("\u4F4E\u5C5E\u6027\u91CD\u5EFA\u987B\u7531\u4E3B\u6301\u4EBA\u8BB8\u53EF\uFF1B\u7A0B\u5E8F\u4E0D\u4F1A\u81EA\u52A8\u91CD\u63B7\u3002", "Replacing a poor character needs referee permission; no automatic rerolls.")] });
  add("adnd1e", "dmg-I", text("\u65B9\u6CD5 I\uFF1A\u56DB\u9AB0\u53BB\u6700\u4F4E", "Method I: 4d6, drop lowest"), text("\u516D\u6B21 4d6\uFF0C\u5404\u53BB\u6389\u4E00\u9897\u6700\u4F4E\u9AB0\uFF1B\u603B\u548C\u81EA\u7531\u5206\u914D\u3002", "Generate six 4d6 totals, dropping one lowest die each time; assign freely."), "assign", { diceCount: 4 });
  add("adnd1e", "dmg-II", text("\u65B9\u6CD5 II\uFF1A\u5341\u4E8C\u53D6\u6700\u9AD8\u516D\u4E2A", "Method II: best six of twelve"), text("\u63B7\u5341\u4E8C\u6B21 3d6\uFF0C\u4FDD\u7559\u6700\u9AD8\u516D\u4E2A\u603B\u548C\uFF0C\u518D\u81EA\u7531\u5206\u914D\u3002", "Keep the highest six of twelve 3d6 totals; assign freely."), "best-six");
  add("adnd1e", "dmg-III", text("\u65B9\u6CD5 III\uFF1A\u6BCF\u9879\u516D\u6B21\u53D6\u6700\u9AD8", "Method III: best of six per ability"), text("\u6BCF\u9879\u5C5E\u6027\u63B7\u516D\u6B21 3d6\uFF0C\u53D6\u8BE5\u9879\u6700\u9AD8\u603B\u548C\uFF1B\u5C5E\u6027\u56FA\u5B9A\u3002", "For each fixed ability, keep the highest of six 3d6 totals."), "best-per-ability");
  add("adnd1e", "dmg-IV", text("\u65B9\u6CD5 IV\uFF1A\u5341\u4E8C\u5957\u9009\u4E00", "Method IV: one of twelve characters"), text("\u751F\u6210\u5341\u4E8C\u5957\u4F9D\u5E8F\u7684\u516D\u9879 3d6 \u5C5E\u6027\uFF0C\u9009\u62E9\u5B8C\u6574\u7684\u4E00\u5957\uFF0C\u4E0D\u80FD\u8DE8\u5957\u62FC\u63A5\u3002", "Generate twelve in-order 3d6 characters; choose one intact set."), "sets");
  add("adnd1e", "ua-V", text("UA \u65B9\u6CD5 V\uFF1A\u804C\u4E1A\u9AB0\u6C60\uFF08\u5F85\u6838\u51C6\uFF09", "UA Method V: class pools (pending)"), text("\u9650\u4EBA\u7C7B\uFF0C\u6309\u804C\u4E1A\u8868\u63B7\u9AB0\u5E76\u53D6\u6700\u9AD8\u4E09\u9897\uFF0C\u518D\u5904\u7406\u804C\u4E1A\u4E0A\u4E0B\u9650\u548C\u5BB9\u8C8C\u3002\u5B8C\u6574\u9650\u5236\u6838\u51C6\u524D\u4E0D\u53EF\u4F7F\u7528\u3002", "Human-only class dice pools, keeping the highest three; class limits and Comeliness apply. Unavailable until full constraints are verified."), "pending", { status: "pending", source: source("AD&D Unearthed Arcana", "pp.6, 14\u201318, 74", "https://donperkins.net/dnd/books/Unearthed_Arcana.pdf", "indexed-original"), notes: [text("\u9AB0\u6570\u8868\u5DF2\u53D6\u5F97\uFF1B\u5B8C\u6574\u804C\u4E1A\u9650\u5236\u4E0E\u7279\u6B8A\u6B65\u9AA4\u4ECD\u5F85\u6838\u51C6\u3002", "Dice counts located; full class constraints and special steps remain under review.")] });
  var two = [
    ["I", text("\u65B9\u6CD5 I\uFF1A\u4E09\u9AB0\u4F9D\u5E8F", "Method I: 3d6 in order"), text("\u6309 STR\u3001DEX\u3001CON\u3001INT\u3001WIS\u3001CHA \u5404\u63B7 3d6\u3002", "Roll 3d6 in order: STR, DEX, CON, INT, WIS, CHA."), "fixed", 3],
    ["II", text("\u65B9\u6CD5 II\uFF1A\u6BCF\u9879\u4E24\u6B21\u62E9\u4E00", "Method II: choose from two per ability"), text("\u6BCF\u9879\u63B7\u4E24\u6B21 3d6\uFF0C\u4EFB\u9009\u4E00\u4E2A\u7ED3\u679C\uFF1B\u5C5E\u6027\u4F4D\u7F6E\u56FA\u5B9A\u3002", "For each fixed ability, choose either of two 3d6 totals."), "pairs", 3],
    ["III", text("\u65B9\u6CD5 III\uFF1A\u4E09\u9AB0\u81EA\u7531\u5206\u914D", "Method III: assign six 3d6 totals"), text("\u63B7\u516D\u6B21 3d6\uFF0C\u81EA\u7531\u5206\u914D\u7ED9\u516D\u9879\u5C5E\u6027\u3002", "Roll six 3d6 totals and assign freely."), "assign", 3],
    ["IV", text("\u65B9\u6CD5 IV\uFF1A\u5341\u4E8C\u6B21\u4EFB\u9009\u516D\u4E2A", "Method IV: choose six of twelve"), text("\u63B7\u5341\u4E8C\u6B21 3d6\uFF0C\u4EFB\u9009\u516D\u4E2A\u7ED3\u679C\u5E76\u81EA\u7531\u5206\u914D\uFF1B\u53EF\u4EE5\u9009\u62E9\u4F4E\u503C\u3002", "Choose any six of twelve 3d6 totals and assign freely, including lower results."), "assign", 3],
    ["V", text("\u65B9\u6CD5 V\uFF1A\u56DB\u9AB0\u53BB\u6700\u4F4E", "Method V: 4d6, drop lowest"), text("\u516D\u6B21 4d6\uFF0C\u5404\u53BB\u4E00\u9897\u6700\u4F4E\u9AB0\uFF1B\u603B\u548C\u81EA\u7531\u5206\u914D\u3002", "Generate six 4d6 totals, dropping one lowest die each time; assign freely."), "assign", 4],
    ["VI", text("\u65B9\u6CD5 VI\uFF1A\u516B\u70B9\u57FA\u7840\u52A0\u4E03\u9897\u9AB0", "Method VI: base eight plus seven dice"), text("\u516D\u9879\u4ECE 8 \u5F00\u59CB\uFF0C\u5C06\u4E03\u9897 d6 \u7684\u7ED3\u679C\u9010\u9897\u5206\u914D\u3002\u5355\u9897\u4E0D\u80FD\u62C6\u5206\uFF0C\u5C5E\u6027\u4E0D\u80FD\u8D85\u8FC7 18\u3002", "Start all scores at 8; allocate seven rolled d6 whole. No score may exceed 18."), "allocate", 1]
  ];
  for (const [id, n, d, mode, diceCount] of two) add("adnd2e", `phb-${id}`, n, d, mode, { diceCount, category: id === "I" ? "standard" : "official-option" });
  var spSource = source("AD&D 2E Player\u2019s Option: Skills & Powers", "pp.8\u20139; Character Generation (Methods VII\u2013X)", "https://regalgoblins.com/2erules/SP/DD02864.htm");
  var spCosts = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [String(i + 3), i + 3]));
  add("adnd2e", "sp-VII", text("\u65B9\u6CD5 VII\uFF1A75 \u70B9\u5206\u914D", "Method VII: 75-point allocation"), text("\u5C06 75 \u70B9\u76F4\u63A5\u5206\u914D\u7ED9\u516D\u9879\u5C5E\u6027\uFF0C\u6BCF\u9879 3\u201318\uFF0C\u603B\u548C\u5FC5\u987B\u4E3A 75\u3002STR 18 \u65F6\u70B9\u51FB\u6295\u4F20\u5947\u529B\u91CF\u3002", "Distribute exactly 75 points among six scores, each 3\u201318. Click to roll exceptional Strength at STR 18."), "buy", { source: spSource, costs: spCosts, base: 3, budgets: [75], defaultBudget: 75 });
  add("adnd2e", "sp-VIII", text("\u65B9\u6CD5 VIII\uFF1A24d6 \u9AB0\u6C60", "Method VIII: 24d6 dice pool"), text("\u63B7\u9AB0\u524D\u5206\u914D 24 \u9897 d6\uFF0C\u6BCF\u9879 3\u20136 \u9897\uFF0C\u53D6\u5404\u9879\u6700\u9AD8\u4E09\u9897\u76F8\u52A0\u3002", "Allocate 24d6 before rolling, 3\u20136 dice per ability, and sum the highest three for each."), "pool", { source: spSource, poolTotals: [24], poolMax: 6 });
  add("adnd2e", "sp-IX", text("\u65B9\u6CD5 IX\uFF1A\u968F\u673A\u9884\u7B97\u5206\u914D", "Method IX: random point allocation"), text("\u5148\u6295 2d6 \u67E5\u8868\u53D6\u5F97 68\u201380 \u70B9\u9884\u7B97\u53CA 15\u201318 \u7684\u5355\u9879\u4E0A\u9650\uFF0C\u518D\u76F4\u63A5\u5206\u914D\u5168\u90E8\u70B9\u6570\uFF0C\u6BCF\u9879\u81F3\u5C11 3\u3002STR 18 \u65F6\u70B9\u51FB\u6295\u4F20\u5947\u529B\u91CF\u3002", "Roll 2d6 for a 68\u201380 point budget and a 15\u201318 score cap, then distribute all points, minimum 3 per score. Click to roll exceptional Strength at STR 18."), "buy", { source: spSource, costs: spCosts, base: 3, randomBudget: true });
  add("adnd2e", "sp-X", text("\u65B9\u6CD5 X\uFF1A75 \u70B9\u542B\u4F20\u5947\u529B\u91CF\u8D2D\u4E70", "Method X: 75 points including exceptional Strength"), text("\u5C06 75 \u70B9\u76F4\u63A5\u5206\u914D\uFF0C\u6BCF\u9879 3\u201318\uFF1BSTR 18 \u540E\u6BCF\u989D\u5916 1 \u70B9\u8D2D\u4E70 10% \u4F20\u5947\u529B\u91CF\u300218/30 \u5171\u82B1 21 \u70B9\uFF0C18/00 \u5171\u82B1 28 \u70B9\u3002", "Distribute exactly 75 points, each score 3\u201318. At STR 18, each extra point buys 10 exceptional Strength percentage points: 18/30 costs 21 and 18/00 costs 28."), "buy", { source: spSource, costs: spCosts, base: 3, budgets: [75], defaultBudget: 75 });
  add("dnd35", "phb-roll", text("\u6807\u51C6\u968F\u673A\u751F\u6210", "Standard random generation"), text("\u516D\u6B21 4d6 \u53BB\u6700\u4F4E\uFF0C\u81EA\u7531\u5206\u914D\u3002\u79CD\u65CF\u8C03\u6574\u524D\uFF0C\u8C03\u6574\u503C\u603B\u548C\u22640 \u6216\u6700\u9AD8\u5C5E\u6027\u226413 \u65F6\uFF0C\u53EF\u91CD\u63B7\u6574\u7EC4\u3002", "Assign six 4d6-drop-lowest totals. Before racial changes, a modifier sum \u22640 or highest score \u226413 permits a whole-set reroll."), "assign", { diceCount: 4, category: "standard" });
  add("dnd35", "dmg-point-buy", text("\u8D2D\u70B9", "Point buy"), text("\u516D\u9879\u4ECE 8 \u5F00\u59CB\uFF0C\u6309 3.5 \u8868\u8D2D\u4E70\u5230\u6700\u9AD8 18\uFF1B\u6807\u51C6 25 \u70B9\uFF0C\u53E6\u6709 15/22/28/32 \u70B9\u3002", "Start at 8; buy up to 18 using 3.5 costs. Standard budget 25; alternatives 15/22/28/32."), "buy", { source: dmg35, costs: costs35, budgets: [15, 22, 25, 28, 32], defaultBudget: 25 });
  add("dnd35", "dmg-elite-array", text("\u7CBE\u82F1\u6570\u7EC4", "Elite array"), text("\u5C06 15\u300114\u300113\u300112\u300110\u30018 \u5206\u914D\u7ED9\u516D\u9879\u5C5E\u6027\uFF0C\u4E0D\u63B7\u9AB0\u3002", "Assign 15, 14, 13, 12, 10, 8 to the six abilities without rolling."), "array", { source: dmg35 });
  add("pf1", "standard", text("\u6807\u51C6", "Standard"), text("\u516D\u6B21 4d6\uFF0C\u5404\u53BB\u4E00\u9897\u6700\u4F4E\u9AB0\uFF0C\u603B\u548C\u81EA\u7531\u5206\u914D\u3002", "Assign six 4d6 totals with one lowest die removed from each."), "assign", { diceCount: 4, category: "standard" });
  add("pf1", "classic", text("\u7ECF\u5178", "Classic"), text("\u516D\u6B21 3d6\uFF0C\u81EA\u7531\u5206\u914D\uFF1B\u4E5F\u53EF\u5728\u5F00\u59CB\u524D\u9009\u62E9\u4F9D\u5E8F\u586B\u5199\u3002", "Generate six 3d6 totals; assign freely or choose in-order generation before starting."), "assign", { canChooseOrder: true });
  add("pf1", "heroic", text("\u82F1\u96C4", "Heroic"), text("\u63B7\u516D\u7EC4 2d6+6\uFF0C\u603B\u548C\u81EA\u7531\u5206\u914D\u3002", "Generate six 2d6+6 totals and assign freely."), "assign", { diceCount: 2, keep: 2, bonus: 6 });
  add("pf1", "dice-pool", text("\u9AB0\u6C60", "Dice Pool"), text("\u63B7\u9AB0\u524D\u5206\u914D 24 \u9897 d6\uFF0C\u6BCF\u9879\u81F3\u5C11\u4E09\u9897\uFF1B\u5404\u9879\u53D6\u6700\u9AD8\u4E09\u9897\u3002\u9AD8\u5F3A\u5EA6\u9009\u9879\u4E3A 28 \u9897\u3002", "Allocate 24 d6 before rolling, at least three per ability; retain each ability\u2019s highest three. Higher-powered option: 28 dice."), "pool", { poolTotals: [24, 28] });
  add("pf1", "purchase", text("\u8D2D\u70B9", "Purchase"), text("\u4ECE 10 \u5F00\u59CB\uFF0C\u6309 PF1 \u6210\u672C\u589E\u51CF\u81F3 7\u201318\uFF1B\u9884\u7B97 10/15/20/25 \u70B9\uFF0C\u6807\u51C6 15 \u70B9\u3002", "Start at 10; purchase or lower scores within 7\u201318 using PF1 costs. Budgets 10/15/20/25; standard 15."), "buy", { base: 10, costs: costsPF, budgets: [10, 15, 20, 25], defaultBudget: 15 });
  for (const v of ["dnd5e2014", "dnd5e2024"]) {
    add(v, "roll", text("\u968F\u673A\u751F\u6210", "Random generation"), text("\u516D\u6B21 4d6\uFF0C\u5404\u53D6\u6700\u9AD8\u4E09\u9897\u76F8\u52A0\uFF1B\u603B\u548C\u81EA\u7531\u5206\u914D\u3002\u6CA1\u6709\u9ED8\u8BA4\u4F4E\u503C\u91CD\u63B7\u6761\u4EF6\u3002", "Assign six totals from the highest three of four d6. No default low-score reroll rule."), "assign", { diceCount: 4, category: "standard" });
    add(v, "array", text("\u6807\u51C6\u6570\u7EC4", "Standard array"), text("\u5C06 15\u300114\u300113\u300112\u300110\u30018 \u5206\u914D\u7ED9\u516D\u9879\u5C5E\u6027\u3002", "Assign 15, 14, 13, 12, 10, 8 to the six abilities."), "array", { category: "standard" });
    add(v, "point-buy", text("27 \u70B9\u8D2D\u70B9", "27-point buy"), text("\u6309 5E \u6210\u672C\u8868\u8D2D\u4E70\u516D\u9879\u57FA\u7840\u5C5E\u6027\uFF0C\u8303\u56F4 8\u201315\uFF0C\u5171 27 \u70B9\u3002", "Spend 27 points using 5E costs; each base score must be 8\u201315."), "buy", { costs: costs5, budgets: [27], defaultBudget: 27, category: v === "dnd5e2014" ? "official-option" : "standard" });
  }
  var methods = freeze(result);
  var classes = freeze([
    { id: "fighter", name: text("\u6218\u58EB", "Fighter"), donors: ["INT", "WIS"], targets: ["STR"], minimums: {} },
    { id: "dwarf", name: text("\u77EE\u4EBA", "Dwarf"), donors: ["INT", "WIS"], targets: ["STR"], minimums: { CON: 9 } },
    { id: "elf", name: text("\u7CBE\u7075", "Elf"), donors: ["WIS"], targets: ["STR", "INT"], minimums: { INT: 9 } },
    { id: "halfling", name: text("\u534A\u8EAB\u4EBA", "Halfling"), donors: ["INT", "WIS"], targets: ["STR", "DEX"], minimums: { DEX: 9, CON: 9 } },
    { id: "magic-user", name: text("\u9B54\u6CD5\u5E08", "Magic-User"), donors: ["STR", "WIS"], targets: ["INT"], minimums: {} },
    { id: "cleric", name: text("\u7267\u5E08", "Cleric"), donors: ["STR", "INT"], targets: ["WIS"], minimums: {} },
    { id: "thief", name: text("\u76D7\u8D3C", "Thief"), donors: ["INT", "WIS"], targets: ["DEX"], minimums: {} }
  ]);
  freeze(ABILITIES);
  freeze(OLD_ORDER);

  // packages/core/src/errors.ts
  var RuleError = class extends Error {
    code;
    messages;
    constructor(code, zh, en) {
      super(en);
      this.name = "RuleError";
      this.code = code;
      this.messages = text(zh, en);
    }
  };

  // packages/core/src/dcc.ts
  function dccAbilityModifier(score) {
    if (!Number.isInteger(score) || score < 3 || score > 18) throw new RangeError("DCC base ability scores must be integers from 3 to 18.");
    if (score === 3) return -3;
    if (score <= 5) return -2;
    if (score <= 8) return -1;
    if (score <= 12) return 0;
    if (score <= 15) return 1;
    if (score <= 17) return 2;
    return 3;
  }

  // packages/core/src/ability-display.ts
  var standard = freeze({
    STR: { slot: "STR", id: "STR", name: { zh: "\u529B\u91CF", en: "Strength" } },
    DEX: { slot: "DEX", id: "DEX", name: { zh: "\u654F\u6377", en: "Dexterity" } },
    CON: { slot: "CON", id: "CON", name: { zh: "\u4F53\u8D28", en: "Constitution" } },
    INT: { slot: "INT", id: "INT", name: { zh: "\u667A\u529B", en: "Intelligence" } },
    WIS: { slot: "WIS", id: "WIS", name: { zh: "\u611F\u77E5", en: "Wisdom" } },
    CHA: { slot: "CHA", id: "CHA", name: { zh: "\u9B45\u529B", en: "Charisma" } }
  });
  var dcc = freeze({
    STR: standard.STR,
    DEX: { slot: "DEX", id: "AGI", name: { zh: "\u654F\u6377", en: "Agility" } },
    CON: { slot: "CON", id: "STA", name: { zh: "\u8010\u529B", en: "Stamina" } },
    WIS: { slot: "WIS", id: "PER", name: { zh: "\u4EBA\u683C", en: "Personality" } },
    INT: standard.INT,
    CHA: { slot: "CHA", id: "LCK", name: { zh: "\u5E78\u8FD0", en: "Luck" } }
  });
  var wisdom2e = freeze({ slot: "WIS", id: "WIS", name: { zh: "\u7075\u77E5", en: "Wisdom" } });
  function getAbilityDisplay(versionId, slot) {
    if (!versions.some((v) => v.id === versionId) || !ABILITIES.includes(slot)) throw new RangeError("Unknown edition or ability slot.");
    return versionId === "dcc" ? dcc[slot] : versionId === "adnd2e" && slot === "WIS" ? wisdom2e : standard[slot];
  }
  function getAbilityMapping(versionId) {
    const version = versions.find((v) => v.id === versionId);
    if (!version) throw new RangeError("Unknown edition.");
    return freeze(version.order.map((slot) => getAbilityDisplay(versionId, slot)));
  }
  function toNativeScores(versionId, scores) {
    return freeze(Object.fromEntries(getAbilityMapping(versionId).filter(({ slot }) => scores[slot] !== void 0).map(({ slot, id }) => [id, scores[slot]])));
  }

  // packages/core/src/batch.ts
  var BATCH_COUNTS = freeze([1, 2, 4, 8]);
  var MAX_BATCH_SIZE = 8;
  function isBatchMethod(method, options = {}) {
    return method.status === "ready" && !["bx1981", "ose-classic"].includes(method.versionId) && (method.mode === "fixed" || method.mode === "best-per-ability" || method.mode === "assign" && method.canChooseOrder && options.inOrder === true);
  }
  var BatchGenerationError = class extends RuleError {
    group;
    causeCode;
    cause;
    constructor(group, cause) {
      const error = cause instanceof RuleError ? cause : null;
      super(
        "BATCH_GROUP_FAILED",
        `\u7B2C ${group} \u7EC4\u751F\u6210\u5931\u8D25\uFF1A${error?.messages.zh ?? String(cause)}\u3002\u672C\u6B21\u672A\u8FD4\u56DE\u6279\u91CF\u7ED3\u679C\u3002`,
        `Group ${group} failed: ${error?.messages.en ?? String(cause)}. No batch results were returned.`
      );
      this.name = "BatchGenerationError";
      this.group = group;
      this.cause = cause;
      this.causeCode = error?.code ?? "UNKNOWN";
    }
  };
  function generateBatch(request, count, rng = cryptoRng) {
    if (!Number.isInteger(count) || count < 1 || count > MAX_BATCH_SIZE)
      throw new RuleError("BATCH_COUNT", "\u6279\u91CF\u6570\u91CF\u5FC5\u987B\u662F 1\u20138 \u7684\u6574\u6570\u3002", "Batch count must be an integer from 1 to 8.");
    const normalized = createSession(request).request;
    if (!isBatchMethod(getMethod(normalized.methodId), normalized.options))
      throw new RuleError("BATCH_UNSUPPORTED", "\u8BE5\u65B9\u6CD5\u4ECD\u9700\u73A9\u5BB6\u9009\u62E9\u6216\u914D\u7F6E\uFF0C\u4E0D\u80FD\u4E00\u952E\u6279\u91CF\u5B8C\u6210\u3002", "This method needs player choices or configuration and cannot be completed in one batch action.");
    const results = [];
    for (let index = 1; index <= count; index++) {
      try {
        let session = createSession(normalized);
        session = applyAction(session, { type: "roll" }, rng);
        if (!getSessionView(session).canFinalize)
          throw new RuleError("INCOMPLETE", "\u672C\u7EC4\u4ECD\u6709\u672A\u5B8C\u6210\u7684\u9009\u62E9\u3002", "This group still requires choices.");
        session = applyAction(session, { type: "finalize" }, rng);
        results.push({ index, session, view: getSessionView(session) });
      } catch (error) {
        throw new BatchGenerationError(index, error);
      }
    }
    return freeze(results);
  }

  // packages/core/src/index.ts
  function requireRule(ok, code, zh, en) {
    if (!ok) throw new RuleError(code, zh, en);
  }
  function object(v) {
    requireRule(v !== null && typeof v === "object" && !Array.isArray(v), "BAD_OBJECT", "\u9700\u8981\u5BF9\u8C61\u3002", "Expected an object.");
  }
  function keys(v, allowed) {
    requireRule(Object.keys(v).every((k) => allowed.includes(k)), "UNKNOWN_FIELD", "\u5305\u542B\u672A\u77E5\u5B57\u6BB5\u3002", "Unknown field.");
  }
  var ability = (v) => ABILITIES.includes(v);
  var isRandomMethod = (m) => m.status === "ready" && (m.randomBudget === true || !["buy", "array"].includes(m.mode));
  function formatAbilityScore(ab, score, percent = null) {
    return score === void 0 ? "\u2014" : ab === "STR" && score === 18 && percent !== null ? `18/${percent === 100 ? "00" : String(percent).padStart(2, "0")}` : String(score);
  }
  var exceptionalVersion = (m) => m.versionId === "adnd1e" || m.versionId === "adnd2e";
  var classMode = (m) => m.versionId === "bx1981" || m.versionId === "ose-classic";
  var allScores = (n) => Object.fromEntries(ABILITIES.map((a) => [a, n]));
  var sum = (values) => values.reduce((a, b) => a + b, 0);
  var listVersions = () => versions;
  function listMethods(versionId) {
    requireRule(versions.some((v) => v.id === versionId), "UNKNOWN_VERSION", "\u672A\u77E5\u6E38\u620F\u7248\u672C\u3002", "Unknown game version.");
    return freeze(methods.filter((m) => m.versionId === versionId));
  }
  function getMethod(id) {
    const m = methods.find((m2) => m2.id === id);
    requireRule(m, "UNKNOWN_METHOD", "\u672A\u77E5\u751F\u6210\u65B9\u6CD5\u3002", "Unknown generation method.");
    return m;
  }
  function normalizeRequest(input) {
    object(input);
    keys(input, ["versionId", "methodId", "options"]);
    requireRule(typeof input.methodId === "string", "BAD_REQUEST", "\u9700\u8981\u65B9\u6CD5\u6807\u8BC6\u3002", "Method ID required.");
    const m = getMethod(input.methodId);
    requireRule(input.versionId === m.versionId, "VERSION_MISMATCH", "\u65B9\u6CD5\u4E0D\u5C5E\u4E8E\u8BE5\u7248\u672C\u3002", "Method does not belong to this version.");
    requireRule(m.status === "ready", "METHOD_PENDING", "\u8BE5\u65B9\u6CD5\u5C1A\u672A\u6838\u51C6\uFF0C\u6682\u4E0D\u53EF\u7528\u3002", "This method is pending verification.");
    const opts = input.options ?? {};
    object(opts);
    keys(opts, ["budget", "inOrder", "poolTotal"]);
    const options = {};
    if (m.mode === "buy" && !m.randomBudget) {
      const budget = opts.budget ?? m.defaultBudget;
      requireRule(typeof budget === "number" && m.budgets.includes(budget), "BAD_BUDGET", "\u8BF7\u9009\u62E9\u5DF2\u5217\u51FA\u7684\u5B98\u65B9\u9884\u7B97\u3002", "Select a listed official budget.");
      options.budget = budget;
    } else requireRule(opts.budget === void 0, "BAD_OPTION", "\u8BE5\u65B9\u6CD5\u4E0D\u4F7F\u7528\u8D2D\u70B9\u9884\u7B97\u3002", "This method has no point budget.");
    if (m.canChooseOrder) {
      requireRule(opts.inOrder === void 0 || typeof opts.inOrder === "boolean", "BAD_OPTION", "\u4F9D\u5E8F\u9009\u9879\u987B\u4E3A\u5E03\u5C14\u503C\u3002", "inOrder must be boolean.");
      options.inOrder = opts.inOrder ?? false;
    } else requireRule(opts.inOrder === void 0, "BAD_OPTION", "\u8BE5\u65B9\u6CD5\u4E0D\u80FD\u5207\u6362\u987A\u5E8F\u3002", "This method has no order option.");
    if (m.mode === "pool") {
      const total = opts.poolTotal ?? 24;
      requireRule(typeof total === "number" && m.poolTotals.includes(total), "BAD_POOL", "\u9AB0\u6C60\u603B\u6570\u987B\u4E3A 24 \u6216 28\u3002", "Pool total must be 24 or 28.");
      options.poolTotal = total;
    } else requireRule(opts.poolTotal === void 0, "BAD_OPTION", "\u8BE5\u65B9\u6CD5\u6CA1\u6709\u9AB0\u6C60\u603B\u6570\u3002", "This method has no pool total.");
    return { versionId: m.versionId, methodId: m.id, options };
  }
  function createSession(request) {
    return freeze({ schemaVersion: 1, rulesVersion: RULES_VERSION, request: normalizeRequest(request), events: [] });
  }
  function cryptoRng(sides) {
    requireRule(Number.isInteger(sides) && sides >= 2 && sides <= 4294967296, "BAD_SIDES", "\u9AB0\u5B50\u9762\u6570\u65E0\u6548\u3002", "Invalid die sides.");
    requireRule(typeof globalThis.crypto?.getRandomValues === "function", "NO_CRYPTO", "\u5F53\u524D\u73AF\u5883\u6CA1\u6709\u5B89\u5168\u968F\u673A\u6570\u6E90\uFF0C\u8BF7\u7531\u9002\u914D\u5668\u63D0\u4F9B\u3002", "No secure random source; provide one from the adapter.");
    const a = new Uint32Array(1), limit = Math.floor(4294967296 / sides) * sides;
    do {
      globalThis.crypto.getRandomValues(a);
    } while (a[0] >= limit);
    return a[0] % sides + 1;
  }
  function sequenceRng(values) {
    const copy = [...values];
    let i = 0;
    return (sides) => {
      const n = copy[i++];
      requireRule(Number.isInteger(n) && n >= 1 && n <= sides, "BAD_RNG", "\u56FA\u5B9A\u9AB0\u5E8F\u5217\u8017\u5C3D\u6216\u6570\u503C\u65E0\u6548\u3002", "Fixed dice exhausted or invalid.");
      return n;
    };
  }
  function normalizedAction(input) {
    object(input);
    const t = input.type;
    requireRule(typeof t === "string", "BAD_ACTION", "\u7F3A\u5C11\u64CD\u4F5C\u7C7B\u578B\u3002", "Action type required.");
    const fields = { roll: [], rollExceptional: [], buyExceptional: ["percent"], setPool: ["counts"], assign: ["assignments"], choosePair: ["ability", "candidateId"], chooseSet: ["setId"], allocateDie: ["dieId", "ability"], setScore: ["ability", "score"], selectClass: ["classId"], trade: ["from", "to"], resetAdjustments: [], reroll: ["reason", "note"], finalize: ["acceptUnspent"] };
    requireRule(Object.hasOwn(fields, t), "BAD_ACTION", "\u672A\u77E5\u64CD\u4F5C\u3002", "Unknown action.");
    keys(input, ["type", ...fields[t]]);
    switch (t) {
      case "buyExceptional":
        requireRule(Number.isInteger(input.percent) && input.percent >= 0 && input.percent <= 100 && input.percent % 10 === 0, "BAD_PERCENT", "\u8D2D\u4E70\u767E\u5206\u6BD4\u987B\u4E3A 0\u2013100 \u7684\u5341\u500D\u6570\u3002", "Purchased percentage must be a multiple of ten from 0 to 100.");
        break;
      case "setPool":
        object(input.counts);
        keys(input.counts, ABILITIES);
        requireRule(ABILITIES.every((a) => Number.isInteger(input.counts[a])), "BAD_POOL", "\u516D\u9879\u9AB0\u6570\u5FC5\u987B\u4E3A\u6574\u6570\u3002", "All six dice counts must be integers.");
        break;
      case "assign":
        object(input.assignments);
        keys(input.assignments, ABILITIES);
        requireRule(Object.values(input.assignments).every((v) => typeof v === "string"), "BAD_ASSIGNMENT", "\u5019\u9009\u7ED3\u679C\u6807\u8BC6\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u3002", "Candidate IDs must be strings.");
        break;
      case "choosePair":
        requireRule(ability(input.ability) && typeof input.candidateId === "string", "BAD_ACTION", "\u9009\u62E9\u53C2\u6570\u65E0\u6548\u3002", "Invalid pair selection.");
        break;
      case "chooseSet":
        requireRule(typeof input.setId === "string", "BAD_ACTION", "\u7F3A\u5C11\u6574\u5957\u6807\u8BC6\u3002", "Set ID required.");
        break;
      case "allocateDie":
        requireRule(typeof input.dieId === "string" && (input.ability === null || ability(input.ability)), "BAD_ACTION", "\u9AB0\u5B50\u5206\u914D\u53C2\u6570\u65E0\u6548\u3002", "Invalid die allocation.");
        break;
      case "setScore":
        requireRule(ability(input.ability) && Number.isInteger(input.score), "BAD_ACTION", "\u5C5E\u6027\u6216\u6570\u503C\u65E0\u6548\u3002", "Invalid ability or score.");
        break;
      case "selectClass":
        requireRule(input.classId === null || classes.some((c) => c.id === input.classId), "BAD_CLASS", "\u672A\u77E5\u804C\u4E1A\u3002", "Unknown class.");
        break;
      case "trade":
        requireRule(ability(input.from) && ability(input.to), "BAD_ACTION", "\u4EA4\u6362\u5C5E\u6027\u65E0\u6548\u3002", "Invalid exchange abilities.");
        break;
      case "reroll":
        requireRule(input.reason === "rule" || input.reason === "referee", "BAD_REASON", "\u987B\u6307\u5B9A\u91CD\u63B7\u7406\u7531\u3002", "Reroll reason required.");
        requireRule(input.note === void 0 || typeof input.note === "string" && input.note.length <= 500, "BAD_NOTE", "\u8BF4\u660E\u5FC5\u987B\u662F 500 \u5B57\u7B26\u4EE5\u5185\u7684\u6587\u672C\u3002", "Note must be text of at most 500 characters.");
        break;
      case "finalize":
        requireRule(input.acceptUnspent === void 0 || typeof input.acceptUnspent === "boolean", "BAD_ACTION", "\u786E\u8BA4\u53C2\u6570\u65E0\u6548\u3002", "Invalid confirmation.");
        break;
    }
    return structuredClone(input);
  }
  function newAttempt(m, number) {
    const a = { number, exceptionalStrength: null, pointGeneration: null, candidates: [], looseDice: [], assignments: {}, selectedSet: null, allocations: {}, baseScores: {}, scores: {}, selectedClass: null, trades: [], poolCounts: allScores(3), generated: false };
    if (m.mode === "buy" && !m.randomBudget) {
      a.baseScores = allScores(m.base);
      a.scores = { ...a.baseScores };
      a.generated = true;
    }
    if (m.mode === "array") {
      a.candidates = [15, 14, 13, 12, 10, 8].map((total, i) => ({ id: `a${number}.r${i + 1}`, total, dice: [], ability: null, setId: null, eligible: true }));
      a.generated = true;
    }
    return a;
  }
  function rollAttempt(r, rng) {
    const m = r.method, a = r.attempt, order = versions.find((v) => v.id === m.versionId).order;
    const die = () => {
      const n = rng(6);
      requireRule(Number.isInteger(n) && n >= 1 && n <= 6, "BAD_RNG", "\u968F\u673A\u6E90\u5FC5\u987B\u8FD4\u56DE 1\u20136 \u7684\u6574\u6570\u3002", "RNG must return an integer from 1 to 6.");
      return n;
    };
    function group(count, target = null, setId = null) {
      const id = `a${a.number}.r${a.candidates.length + 1}`;
      const values = Array.from({ length: count }, () => die());
      const kept = new Set(values.map((v, i) => ({ v, i })).sort((x, y) => y.v - x.v || x.i - y.i).slice(0, m.keep).map((x) => x.i));
      const dice = values.map((value, i) => ({ id: `${id}.d${i + 1}`, value, kept: kept.has(i) }));
      const c = { id, dice, total: sum(dice.filter((d) => d.kept).map((d) => d.value)) + m.bonus, ability: target, setId, eligible: true };
      a.candidates.push(c);
      return c;
    }
    if (m.randomBudget) {
      const rolls = [die(), die()], row = POINT_GENERATION[sum(rolls) - 2];
      a.pointGeneration = { rolls, budget: row[0], maximum: row[1] };
      a.baseScores = allScores(3);
      a.scores = { ...a.baseScores };
      a.generated = true;
      return;
    }
    if (m.mode === "allocate") {
      a.looseDice = Array.from({ length: 7 }, (_, i) => ({ id: `a${a.number}.d${i + 1}`, value: die(), kept: true }));
      a.baseScores = allScores(8);
    } else if (m.mode === "sets") {
      for (let i = 1; i <= 12; i++) for (const stat of order) group(3, stat, `a${a.number}.set${i}`);
    } else if (m.mode === "pairs" || m.mode === "best-per-ability") {
      for (const stat of order) {
        const batch = Array.from({ length: m.mode === "pairs" ? 2 : 6 }, () => group(3, stat));
        if (m.mode === "best-per-ability") {
          const best = [...batch].sort((x, y) => y.total - x.total)[0];
          a.assignments[stat] = best.id;
          a.baseScores[stat] = best.total;
        }
      }
    } else if (m.mode === "pool") {
      for (const stat of order) {
        const c = group(a.poolCounts[stat], stat);
        a.baseScores[stat] = c.total;
        a.assignments[stat] = c.id;
      }
    } else {
      const fixed = m.mode === "fixed" || r.request.options?.inOrder === true;
      const count = m.mode === "best-six" || m.id === "adnd2e.phb-IV" ? 12 : 6;
      for (let i = 0; i < count; i++) {
        const target = fixed ? order[i] : null, c = group(m.diceCount, target);
        if (target) {
          a.baseScores[target] = c.total;
          a.assignments[target] = c.id;
        }
      }
      if (m.mode === "best-six") {
        const cutoff = [...a.candidates].sort((x, y) => y.total - x.total)[5].total;
        for (const c of a.candidates) c.eligible = c.total >= cutoff;
      }
    }
    a.generated = true;
    a.scores = { ...a.baseScores };
  }
  var POINT_GENERATION = [[68, 18], [70, 18], [72, 17], [72, 18], [74, 17], [74, 18], [76, 17], [76, 16], [78, 16], [78, 15], [80, 15]];
  function pointBuy(r) {
    if (r.method.mode !== "buy" || !r.attempt.generated) return null;
    const costs = Object.fromEntries(Object.entries(r.method.costs).filter(([score]) => Number(score) <= (r.attempt.pointGeneration?.maximum ?? 18)));
    const extra = r.method.id === "adnd2e.sp-X" && r.attempt.scores.STR === 18 ? (r.attempt.exceptionalStrength ?? 0) / 10 : 0;
    const spent = sum(ABILITIES.map((a) => costs[String(r.attempt.scores[a])])) + extra, budget = r.attempt.pointGeneration?.budget ?? r.request.options.budget;
    return { spent, budget, remaining: budget - spent, costs };
  }
  function issues(r) {
    const out = [], a = r.attempt;
    const push = (code, zh, en, severity = "error") => out.push({ code, severity, message: text(zh, en) });
    if (!a.generated) push("NOT_GENERATED", "\u5C1A\u672A\u751F\u6210\u5C5E\u6027\u3002", "Generate scores first.");
    else if (!ABILITIES.every((s) => a.scores[s] !== void 0)) push("INCOMPLETE", "\u8BF7\u5B8C\u6210\u6240\u6709\u9009\u62E9\u6216\u5206\u914D\u3002", "Complete all selections or assignments.");
    if (r.method.mode === "allocate" && a.generated && Object.keys(a.allocations).length !== 7) push("UNALLOCATED", "\u8FD8\u6709\u9AB0\u5B50\u672A\u5206\u914D\u3002", "Some dice remain unallocated.");
    if (r.method.mode === "best-six" && Object.keys(a.assignments).length === 6) {
      const chosen = Object.values(a.assignments).map((id) => a.candidates.find((c) => c.id === id).total).sort((x, y) => y - x);
      const expected = a.candidates.map((c) => c.total).sort((x, y) => y - x).slice(0, 6);
      if (chosen.some((n, i) => n !== expected[i])) push("NOT_BEST_SIX", "\u5FC5\u987B\u4FDD\u7559\u6700\u9AD8\u516D\u4E2A\u603B\u548C\u3002", "Retain the six highest totals.");
    }
    const pb = pointBuy(r);
    if (pb && pb.remaining < 0) push("OVER_BUDGET", "\u8D2D\u70B9\u8D85\u51FA\u9884\u7B97\u3002", "Point budget exceeded.");
    if (pb && pb.remaining > 0) push("UNSPENT", r.method.id.startsWith("adnd2e.sp-") ? "\u5FC5\u987B\u5206\u914D\u5168\u90E8\u5C5E\u6027\u70B9\u3002" : "\u4ECD\u6709\u70B9\u6570\u672A\u4F7F\u7528\uFF1B\u5B8C\u6210\u65F6\u9700\u660E\u786E\u786E\u8BA4\u3002", r.method.id.startsWith("adnd2e.sp-") ? "Allocate all ability points." : "Points remain; explicitly acknowledge them when finalizing.", r.method.id.startsWith("adnd2e.sp-") ? "error" : "warning");
    if (exceptionalVersion(r.method) && r.method.mode === "buy" && r.method.id !== "adnd2e.sp-X" && a.scores.STR === 18 && a.exceptionalStrength === null) push("EXCEPTIONAL_REQUIRED", "\u8BF7\u70B9\u51FB\u6295\u63B7\u4F20\u5947\u529B\u91CF\u3002", "Click to roll exceptional Strength.");
    return out;
  }
  function ruleReroll(r) {
    if (r.method.id !== "dnd35.phb-roll" || !r.attempt.generated) return false;
    const vals = r.attempt.candidates.map((c) => c.total);
    return Math.max(...vals) <= 13 || sum(vals.map((v) => Math.floor((v - 10) / 2))) <= 0;
  }
  function transition(r, action, rng) {
    requireRule(!r.done, "COMPLETED", "\u5DF2\u5B8C\u6210\u7684\u8BB0\u5F55\u4E0D\u80FD\u4FEE\u6539\uFF0C\u8BF7\u65B0\u5EFA\u4E00\u6B21\u751F\u6210\u3002", "Completed sessions are locked; start a new session.");
    const a = r.attempt, m = r.method;
    const generated = () => requireRule(a.generated, "NOT_GENERATED", "\u8BF7\u5148\u751F\u6210\u5C5E\u6027\u3002", "Generate scores first.");
    switch (action.type) {
      case "rollExceptional": {
        generated();
        requireRule(exceptionalVersion(m) && a.scores.STR === 18 && m.id !== "adnd2e.sp-X" && a.exceptionalStrength === null, "EXCEPTIONAL_NOT_ALLOWED", "\u5F53\u524D\u4E0D\u80FD\u6295\u63B7\u4F20\u5947\u529B\u91CF\u3002", "Exceptional Strength cannot be rolled now.");
        const n = rng(100);
        requireRule(Number.isInteger(n) && n >= 1 && n <= 100, "BAD_RNG", "\u767E\u5206\u9AB0\u5FC5\u987B\u4E3A 1\u2013100\u3002", "Percentile die must be 1\u2013100.");
        a.exceptionalStrength = n;
        break;
      }
      case "buyExceptional":
        generated();
        requireRule(m.id === "adnd2e.sp-X" && a.scores.STR === 18, "EXCEPTIONAL_NOT_ALLOWED", "\u53EA\u6709\u65B9\u6CD5 X \u7684 STR 18 \u53EF\u8D2D\u4E70\u4F20\u5947\u529B\u91CF\u3002", "Only Method X at STR 18 can buy exceptional Strength.");
        a.exceptionalStrength = action.percent || null;
        break;
      case "setPool":
        requireRule(m.mode === "pool" && !a.generated, "WRONG_PHASE", "\u53EA\u80FD\u5728\u63B7\u9AB0\u524D\u5206\u914D\u9AB0\u6570\u3002", "Allocate pool counts before rolling.");
        requireRule(ABILITIES.every((s) => action.counts[s] >= 3 && action.counts[s] <= (m.poolMax ?? r.request.options.poolTotal)), "BAD_POOL", "\u6BCF\u9879\u9AB0\u6570\u8D85\u51FA\u672C\u65B9\u6CD5\u8303\u56F4\u3002", "Dice count outside this method\u2019s range.");
        requireRule(sum(Object.values(action.counts)) === r.request.options.poolTotal, "BAD_POOL_TOTAL", "\u5FC5\u987B\u6070\u597D\u5206\u914D\u5168\u90E8\u9AB0\u6C60\u3002", "Allocate exactly the full dice pool.");
        a.poolCounts = { ...action.counts };
        break;
      case "roll":
        requireRule(!a.generated, "ALREADY_ROLLED", "\u5DF2\u7ECF\u751F\u6210\uFF0C\u4E0D\u80FD\u91CD\u590D\u63B7\u9AB0\u3002", "Already generated; cannot roll again.");
        if (m.mode === "pool") requireRule(sum(Object.values(a.poolCounts)) === r.request.options.poolTotal, "BAD_POOL_TOTAL", "\u8BF7\u5148\u5206\u914D\u5168\u90E8\u9AB0\u6C60\u3002", "Allocate the full pool first.");
        rollAttempt(r, rng);
        break;
      case "assign": {
        generated();
        requireRule(["assign", "best-six", "array"].includes(m.mode) && !r.request.options?.inOrder, "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u4E0D\u80FD\u81EA\u7531\u5206\u914D\u3002", "This method does not permit free assignment.");
        const ids = Object.values(action.assignments);
        requireRule(new Set(ids).size === ids.length, "DUPLICATE_RESULT", "\u540C\u4E00\u4E2A\u7ED3\u679C\u4E0D\u80FD\u91CD\u590D\u4F7F\u7528\u3002", "A result cannot be assigned twice.");
        requireRule(ids.every((id) => a.candidates.some((c) => c.id === id && c.eligible)), "BAD_CANDIDATE", "\u7ED3\u679C\u4E0D\u5B58\u5728\u6216\u4E0D\u53EF\u9009\u62E9\u3002", "Unknown or ineligible candidate.");
        a.assignments = { ...action.assignments };
        a.baseScores = {};
        for (const stat of ABILITIES) {
          const id = a.assignments[stat];
          if (id) a.baseScores[stat] = a.candidates.find((c) => c.id === id).total;
        }
        a.scores = { ...a.baseScores };
        break;
      }
      case "choosePair": {
        generated();
        requireRule(m.mode === "pairs", "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u4E0D\u662F\u9010\u9879\u4E8C\u9009\u4E00\u3002", "Not a per-ability pair method.");
        const c = a.candidates.find((c2) => c2.id === action.candidateId && c2.ability === action.ability);
        requireRule(c, "BAD_CANDIDATE", "\u53EA\u80FD\u9009\u62E9\u8BE5\u5C5E\u6027\u7684\u5019\u9009\u7ED3\u679C\u3002", "Choose a candidate belonging to this ability.");
        a.assignments[action.ability] = c.id;
        a.baseScores[action.ability] = c.total;
        a.scores = { ...a.baseScores };
        break;
      }
      case "chooseSet":
        generated();
        requireRule(m.mode === "sets", "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u4E0D\u662F\u6574\u5957\u9009\u62E9\u3002", "Not a whole-set method.");
        {
          const cs = a.candidates.filter((c) => c.setId === action.setId);
          requireRule(cs.length === 6, "BAD_SET", "\u6574\u5957\u6807\u8BC6\u65E0\u6548\u3002", "Invalid set ID.");
          a.selectedSet = action.setId;
          for (const c of cs) {
            a.baseScores[c.ability] = c.total;
            a.assignments[c.ability] = c.id;
          }
          a.scores = { ...a.baseScores };
        }
        break;
      case "allocateDie": {
        generated();
        requireRule(m.mode === "allocate", "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u4E0D\u80FD\u5206\u914D\u5355\u9897\u9AB0\u5B50\u3002", "Not a rolled-die allocation method.");
        requireRule(a.looseDice.some((d) => d.id === action.dieId), "BAD_DIE", "\u9AB0\u5B50\u6807\u8BC6\u4E0D\u5B58\u5728\u3002", "Unknown die ID.");
        const allocation = { ...a.allocations };
        delete allocation[action.dieId];
        if (action.ability) allocation[action.dieId] = action.ability;
        const scores = allScores(8);
        for (const d of a.looseDice) {
          const target = allocation[d.id];
          if (target) scores[target] += d.value;
        }
        requireRule(ABILITIES.every((s) => scores[s] <= 18), "SCORE_CAP", "\u5206\u914D\u540E\u4E0D\u80FD\u8D85\u8FC7 18\u3002", "Allocation would exceed 18.");
        a.allocations = allocation;
        a.baseScores = scores;
        a.scores = { ...scores };
        break;
      }
      case "setScore":
        requireRule(m.mode === "buy", "WRONG_ACTION", "\u53EA\u6709\u8D2D\u70B9\u5141\u8BB8\u76F4\u63A5\u8BBE\u7F6E\u5C5E\u6027\u3002", "Direct score setting is for point buy.");
        requireRule(Object.hasOwn(pointBuy(r)?.costs ?? {}, String(action.score)), "SCORE_RANGE", "\u6570\u503C\u8D85\u51FA\u672C\u7248\u8D2D\u70B9\u8303\u56F4\u3002", "Score outside this method\u2019s purchase range.");
        if (m.id === "adnd2e.sp-X" && action.ability === "STR" && action.score !== 18) a.exceptionalStrength = null;
        a.baseScores[action.ability] = action.score;
        a.scores = { ...a.baseScores };
        break;
      case "selectClass": {
        generated();
        requireRule(classMode(m), "WRONG_ACTION", "\u6B64\u6B65\u9AA4\u4EC5\u7528\u4E8E B/X \u4E0E OSE \u7ECF\u5178\u804C\u4E1A\u8C03\u6574\u3002", "This step is for B/X and OSE Classic adjustments.");
        const c = classes.find((c2) => c2.id === action.classId);
        if (c) requireRule(ABILITIES.every((s) => (a.baseScores[s] ?? 0) >= (c.minimums[s] ?? 0)), "CLASS_MINIMUM", "\u539F\u59CB\u5C5E\u6027\u4E0D\u6EE1\u8DB3\u8BE5\u804C\u4E1A\u6700\u4F4E\u8981\u6C42\u3002", "Base scores do not meet this class\u2019s minimums.");
        a.selectedClass = action.classId;
        a.trades = [];
        a.scores = { ...a.baseScores };
        break;
      }
      case "trade": {
        generated();
        requireRule(classMode(m), "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u6CA1\u6709\u4E3B\u5C5E\u6027\u4EA4\u6362\u3002", "This method has no prime-requisite exchange.");
        const c = classes.find((c2) => c2.id === a.selectedClass);
        requireRule(c, "CLASS_REQUIRED", "\u8BF7\u5148\u9009\u62E9\u804C\u4E1A\u3002", "Choose a class first.");
        requireRule(c.donors.includes(action.from) && c.targets.includes(action.to), "BAD_TRADE", "\u804C\u4E1A\u4E0D\u5141\u8BB8\u6B64\u4EA4\u6362\u3002", "Class does not permit this exchange.");
        requireRule(a.scores[action.from] >= 11 && a.scores[action.to] < 18, "BAD_TRADE_RANGE", "\u4F9B\u51FA\u5C5E\u6027\u4E0D\u80FD\u4F4E\u4E8E 9\uFF0C\u76EE\u6807\u4E0D\u80FD\u8D85\u8FC7 18\u3002", "Donor cannot fall below 9; target cannot exceed 18.");
        a.scores[action.from] -= 2;
        a.scores[action.to] += 1;
        a.trades.push({ from: action.from, to: action.to });
        break;
      }
      case "resetAdjustments":
        generated();
        requireRule(classMode(m), "WRONG_ACTION", "\u8BE5\u65B9\u6CD5\u6CA1\u6709\u4E3B\u5C5E\u6027\u8C03\u6574\u3002", "This method has no prime-requisite adjustments.");
        a.trades = [];
        a.scores = { ...a.baseScores };
        break;
      case "reroll":
        generated();
        if (action.reason === "rule") requireRule(ruleReroll(r), "REROLL_NOT_ALLOWED", "\u4E0D\u6EE1\u8DB3\u6B64\u65B9\u6CD5\u7684\u91CD\u63B7\u6761\u4EF6\u3002", "This method\u2019s reroll criteria are not met.");
        else {
          requireRule(classMode(m), "REROLL_NOT_ALLOWED", "\u6B64\u65B9\u6CD5\u672A\u63D0\u4F9B\u8BE5\u4E3B\u6301\u4EBA\u88C1\u5B9A\u64CD\u4F5C\u3002", "This method has no such referee replacement operation.");
          requireRule(action.note?.trim(), "REFEREE_NOTE_REQUIRED", "\u8BF7\u8BB0\u5F55\u4E3B\u6301\u4EBA\u8BB8\u53EF\u8BF4\u660E\u3002", "Record the referee\u2019s permission.");
        }
        r.previous.push(structuredClone(a));
        r.attempt = newAttempt(m, a.number + 1);
        rollAttempt(r, rng);
        break;
      case "finalize": {
        const list = issues(r);
        requireRule(!list.some((i) => i.severity === "error"), "INCOMPLETE", "\u8FD8\u6709\u672A\u5B8C\u6210\u6216\u4E0D\u5408\u6CD5\u7684\u6B65\u9AA4\u3002", "Incomplete or invalid generation.");
        requireRule(!list.some((i) => i.code === "UNSPENT") || action.acceptUnspent === true, "UNSPENT_CONFIRMATION", "\u8BF7\u786E\u8BA4\u4FDD\u7559\u672A\u7528\u70B9\u6570\uFF0C\u6216\u7EE7\u7EED\u8D2D\u70B9\u3002", "Confirm unspent points or continue buying.");
        r.done = true;
        break;
      }
    }
  }
  function replay(input) {
    object(input);
    keys(input, ["schemaVersion", "rulesVersion", "request", "events"]);
    requireRule(input.schemaVersion === 1 && (input.rulesVersion === RULES_VERSION || input.rulesVersion === "0.1.0-2026-10-17"), "SCHEMA_VERSION", "\u5B58\u6863\u7248\u672C\u4E0D\u53D7\u652F\u6301\u3002", "Unsupported save or rules version.");
    const request = normalizeRequest(input.request), method = getMethod(request.methodId);
    requireRule(Array.isArray(input.events) && input.events.length <= 2048, "BAD_EVENTS", "\u64CD\u4F5C\u8BB0\u5F55\u683C\u5F0F\u9519\u8BEF\u6216\u8D85\u8FC7 2048 \u9879\u3002", "Invalid event log or more than 2048 events.");
    const runtime = { rulesVersion: input.rulesVersion, request, method, attempt: newAttempt(method, 1), previous: [], done: false }, events = [];
    for (const e of input.events) {
      object(e);
      keys(e, ["action", "dice"]);
      const action = normalizedAction(e.action);
      requireRule(Array.isArray(e.dice) && e.dice.length <= 216 && e.dice.every((n) => Number.isInteger(n) && n >= 1 && n <= 100), "BAD_DICE_LOG", "\u9AB0\u5B50\u8BB0\u5F55\u65E0\u6548\u3002", "Invalid dice log.");
      const dice = e.dice;
      let index = 0;
      transition(runtime, action, (sides) => {
        const n = dice[index++];
        requireRule(n !== void 0, "MISSING_DICE", "\u9AB0\u5B50\u8BB0\u5F55\u4E0D\u5B8C\u6574\u3002", "Missing recorded dice.");
        requireRule(n >= 1 && n <= sides, "BAD_DICE_LOG", "\u8BB0\u5F55\u9AB0\u503C\u8D85\u51FA\u9AB0\u9762\u8303\u56F4\u3002", "Recorded die exceeds die sides.");
        return n;
      });
      requireRule(index === dice.length, "EXTRA_DICE", "\u8BB0\u5F55\u5305\u542B\u591A\u4F59\u9AB0\u5B50\u3002", "Extraneous recorded dice.");
      events.push({ action, dice: [...dice] });
    }
    return { session: { schemaVersion: 1, rulesVersion: input.rulesVersion, request, events }, runtime };
  }
  function applyAction(session, action, rng = cryptoRng) {
    const { session: copy, runtime } = replay(session);
    requireRule(copy.events.length < 2048, "EVENT_LIMIT", "\u672C\u6B21\u64CD\u4F5C\u8BB0\u5F55\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u53E6\u5EFA\u4F1A\u8BDD\u3002", "Event limit reached; start another session.");
    const checked = normalizedAction(action);
    const add2 = (a) => {
      requireRule(copy.events.length < 2048, "EVENT_LIMIT", "\u64CD\u4F5C\u8BB0\u5F55\u5DF2\u8FBE\u4E0A\u9650\u3002", "Event limit reached.");
      const dice = [];
      transition(runtime, a, (sides) => {
        const n = rng(sides);
        dice.push(n);
        return n;
      });
      copy.events.push({ action: a, dice });
    };
    const auto = () => exceptionalVersion(runtime.method) && runtime.method.mode !== "buy" && runtime.attempt.scores.STR === 18 && runtime.attempt.exceptionalStrength === null && !runtime.done;
    if (checked.type === "finalize" && auto()) add2({ type: "rollExceptional" });
    add2(checked);
    if (auto()) add2({ type: "rollExceptional" });
    copy.rulesVersion = RULES_VERSION;
    return freeze(copy);
  }
  function view(r, eventCount) {
    const m = r.method, a = r.attempt, list = issues(r), complete = !list.some((i) => i.severity === "error");
    let phase = "review", allowed = [];
    if (r.done) phase = "complete";
    else if (!a.generated) {
      phase = m.mode === "pool" ? "configure" : "roll";
      allowed = m.mode === "pool" ? ["setPool", "roll"] : ["roll"];
    } else {
      if (m.mode === "buy") {
        phase = "point-buy";
        allowed.push("setScore");
      } else if (m.mode === "pairs") {
        phase = complete ? "review" : "choose-pairs";
        allowed.push("choosePair");
      } else if (m.mode === "sets") {
        phase = complete ? "review" : "choose-set";
        allowed.push("chooseSet");
      } else if (m.mode === "allocate") {
        phase = complete ? "review" : "allocate-dice";
        allowed.push("allocateDie");
      } else if (["array", "assign", "best-six"].includes(m.mode) && !r.request.options?.inOrder) {
        phase = complete ? "review" : "assign";
        allowed.push("assign");
      }
      if (exceptionalVersion(m) && a.scores.STR === 18) {
        if (m.id === "adnd2e.sp-X") allowed.push("buyExceptional");
        else if (a.exceptionalStrength === null) allowed.push("rollExceptional");
      }
      if (classMode(m)) allowed.push("selectClass", "resetAdjustments", ...a.selectedClass ? ["trade"] : []);
      if (ruleReroll(r) || classMode(m)) allowed.push("reroll");
      if (complete) allowed.push("finalize");
    }
    const notices = [text("\u8FD9\u662F\u5C5E\u6027\u751F\u6210\u7ED3\u679C\uFF0C\u4E0D\u662F\u5B8C\u6574\u4EBA\u7269\u5361\u3002", "This is ability generation, not a complete character sheet.")];
    if (r.rulesVersion !== RULES_VERSION) notices.push(text("\u6B64\u4E3A v0.1 \u65E7\u5B58\u6863\uFF0C\u4FDD\u7559\u539F\u9AB0\u70B9\uFF1B\u7EE7\u7EED\u4FEE\u6539\u65F6\u5347\u7EA7\u81F3\u5F53\u524D\u89C4\u5219\u7248\u672C\uFF0C\u5E76\u6309\u9700\u8865\u6295\u4F20\u5947\u529B\u91CF\u3002", "This is a v0.1 save. Existing rolls are preserved; further edits upgrade it to the current rules version and roll exceptional Strength when required."));
    if (m.versionId === "dnd5e2024") notices.push(text("\u5C1A\u672A\u5E94\u7528\u80CC\u666F\u5C5E\u6027\u589E\u52A0\u3002", "Background ability increases are not applied."));
    else if (["pf1", "dnd35", "dnd5e2014"].includes(m.versionId)) notices.push(text("\u5C1A\u672A\u5E94\u7528\u79CD\u65CF\u5C5E\u6027\u8C03\u6574\u3002", "Racial ability adjustments are not applied."));
    else if (m.versionId === "adnd1e" || m.versionId === "adnd2e") notices.push(text("\u4F20\u5947\u529B\u91CF\u6309\u672C\u5DE5\u5177\u7EA6\u5B9A\uFF0C\u4E0D\u68C0\u67E5\u804C\u4E1A\u3001\u79CD\u65CF\u6216\u6027\u522B\u8D44\u683C\u4E0E\u4E0A\u9650\uFF1B\u8BF7\u81EA\u884C\u6309\u56E2\u89C4\u5904\u7406\u3002\u5176\u4ED6\u804C\u4E1A\u3001\u79CD\u65CF\u6761\u4EF6\u53CA\u8C03\u6574\u5C1A\u672A\u5E94\u7528\u3002", "Exceptional Strength ignores class, race and sex eligibility and caps by this tool\u2019s convention; apply your table\u2019s rules yourself. Other class/race checks and adjustments are not applied."));
    else if (m.versionId === "odnd1974") notices.push(text("\u672A\u8FDB\u884C\u4E3B\u5C5E\u6027\u7ECF\u9A8C\u6362\u7B97\u3002", "Prime-requisite XP conversion is not applied."));
    else if (classMode(m) && !a.selectedClass) notices.push(text("\u5C1A\u672A\u9009\u62E9\u804C\u4E1A\u6216\u8FDB\u884C\u4E3B\u5C5E\u6027\u8C03\u6574\u3002", "Class selection and prime-requisite adjustments were skipped."));
    return freeze({ schemaVersion: 1, rulesVersion: r.rulesVersion, version: versions.find((v) => v.id === m.versionId), method: m, options: r.request.options, phase, attempt: a, previousAttempts: r.previous, exceptionalStrength: exceptionalVersion(m) && a.scores.STR === 18 ? { value: a.exceptionalStrength, mode: m.id === "adnd2e.sp-X" ? "purchase" : m.mode === "buy" ? "roll" : "automatic", canRoll: !r.done && m.id !== "adnd2e.sp-X" && a.exceptionalStrength === null, canPurchase: !r.done && m.id === "adnd2e.sp-X" } : null, pointBuy: pointBuy(r), classOptions: classMode(m) ? classes : [], allowedActions: allowed, issues: list, canFinalize: !r.done && complete, canRuleReroll: !r.done && ruleReroll(r), canRefereeReroll: !r.done && a.generated && classMode(m), notices, eventCount });
  }
  function getSessionView(session) {
    const { session: s, runtime } = replay(session);
    return view(runtime, s.events.length);
  }
  function validateSession(session) {
    try {
      const v = getSessionView(session);
      return freeze({ valid: !v.issues.some((i) => i.severity === "error"), complete: v.phase === "complete", issues: v.issues });
    } catch (e) {
      if (e instanceof RuleError) return freeze({ valid: false, complete: false, issues: [{ code: e.code, severity: "error", message: e.messages }] });
      throw e;
    }
  }
  function serializeSession(session) {
    return JSON.stringify(replay(session).session);
  }
  function deserializeSession(json) {
    requireRule(typeof json === "string" && json.length <= 2e6, "SAVE_SIZE", "\u5B58\u6863\u8FC7\u5927\u6216\u4E0D\u662F\u6587\u672C\u3002", "Save is not text or exceeds 2 MB.");
    let input;
    try {
      input = JSON.parse(json);
    } catch {
      throw new RuleError("BAD_JSON", "\u5B58\u6863\u4E0D\u662F\u6709\u6548 JSON\u3002", "Invalid JSON save.");
    }
    return freeze(replay(input).session);
  }
  function exportResult(session) {
    const { session: s, runtime: r } = replay(session);
    requireRule(r.done, "NOT_FINALIZED", "\u8BF7\u5148\u786E\u8BA4\u5B8C\u6210\u3002", "Finalize the session first.");
    const v = view(r, s.events.length);
    return freeze({ schemaVersion: 1, rulesVersion: RULES_VERSION, versionId: s.request.versionId, methodId: s.request.methodId, options: s.request.options, abilityMapping: getAbilityMapping(s.request.versionId), nativeBaseScores: toNativeScores(s.request.versionId, r.attempt.baseScores), nativeScores: toNativeScores(s.request.versionId, r.attempt.scores), nativeModifiers: s.request.versionId === "dcc" ? toNativeScores("dcc", Object.fromEntries(ABILITIES.map((ab) => [ab, dccAbilityModifier(r.attempt.scores[ab])]))) : null, baseScores: r.attempt.baseScores, adjustedScores: r.attempt.scores, exceptionalStrength: r.attempt.scores.STR === 18 ? r.attempt.exceptionalStrength : null, selectedClass: r.attempt.selectedClass, source: r.method.source, scope: "ability-generation-only", notices: v.notices, attempts: [...r.previous, r.attempt], session: s });
  }
  function formatResult(session, locale = "zh") {
    requireRule(locale === "zh" || locale === "en", "BAD_LOCALE", "\u8BED\u8A00\u987B\u4E3A zh \u6216 en\u3002", "Locale must be zh or en.");
    const r = exportResult(session), m = getMethod(r.methodId), v = versions.find((v2) => v2.id === r.versionId);
    const label = (slot) => getAbilityDisplay(v.id, slot).id;
    const lines = [`${v.name[locale]} \xB7 ${m.name[locale]}`, m.description[locale], v.order.map((a) => `${label(a)} ${formatAbilityScore(a, r.adjustedScores[a], r.exceptionalStrength)}${r.nativeModifiers ? ` (${r.nativeModifiers[label(a)] > 0 ? "+" : ""}${r.nativeModifiers[label(a)]})` : ""}`).join(" / "), `${locale === "zh" ? "\u57FA\u7840\u503C" : "Base"}: ${v.order.map((a) => `${label(a)} ${r.baseScores[a]}`).join(" / ")}`, `${locale === "zh" ? "\u65B9\u6CD5\u9009\u9879" : "Options"}: ${JSON.stringify(r.options)}`];
    for (const a of r.attempts) {
      lines.push(`${locale === "zh" ? "\u751F\u6210\u6B21\u6570" : "Attempt"} ${a.number}`);
      for (const c of a.candidates) {
        const bonus = c.total - sum(c.dice.filter((d) => d.kept).map((d) => d.value));
        const expression = c.dice.length ? c.dice.map((d) => d.kept ? String(d.value) : `[${d.value}]`).join("+") + (bonus ? `+${bonus}` : "") : locale === "zh" ? "\u56FA\u5B9A\u6570\u7EC4" : "array";
        lines.push(`${c.id}${c.ability ? " " + label(c.ability) : ""}${c.setId ? " " + c.setId : ""}: ${expression} = ${c.total}`);
      }
      for (const d of a.looseDice) lines.push(`${d.id}: ${d.value} \u2192 ${a.allocations[d.id] ? label(a.allocations[d.id]) : "\u2014"}`);
      if (a.exceptionalStrength !== null) lines.push(`${locale === "zh" ? "\u4F20\u5947\u529B\u91CF" : "Exceptional Strength"}: ${formatAbilityScore("STR", 18, a.exceptionalStrength)}`);
      if (a.pointGeneration) lines.push(`${locale === "zh" ? "\u9884\u7B97\u9AB0" : "Budget roll"}: ${a.pointGeneration.rolls.join("+")} \u2192 ${a.pointGeneration.budget}, max ${a.pointGeneration.maximum}`);
      if (Object.keys(a.assignments).length) lines.push(`${locale === "zh" ? "\u7ED3\u679C\u5206\u914D" : "Assignments"}: ${JSON.stringify(Object.fromEntries(Object.entries(a.assignments).map(([slot, id]) => [label(slot), id])))}`);
      if (a.selectedClass) lines.push(`${locale === "zh" ? "\u804C\u4E1A" : "Class"}: ${classes.find((c) => c.id === a.selectedClass).name[locale]}`);
      for (const t of a.trades) lines.push(`${label(t.from)} -2 \u2192 ${label(t.to)} +1`);
    }
    for (const e of r.session.events) if (e.action.type === "reroll") lines.push(`${locale === "zh" ? "\u91CD\u63B7" : "Reroll"}: ${e.action.reason}${e.action.note ? " \u2014 " + e.action.note : ""}`);
    lines.push(`${m.source.title}, ${m.source.location}`, m.source.url, ...r.notices.map((n) => n[locale]), `Rules ${r.session.rulesVersion}`);
    return lines.join("\n");
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=dndroll.browser.js.map
