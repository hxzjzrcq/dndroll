// QA only. External Playwright/Chromium paths are supplied through environment variables.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createSession, applyAction, sequenceRng, serializeSession, deserializeSession, exportResult, getSessionView, generateBatch, formatResult, validateSession } from '../../packages/core/dist/index.js';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=fileURLToPath(new URL('./',import.meta.url));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const {default:bundle}=await import(process.env.CHROMIUM_MODULE);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,headless:true,args:bundle.args.filter(a=>!['--disable-web-security','--allow-running-insecure-content'].includes(a))});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,offline:true});
 const page=await context.newPage();page.setDefaultTimeout(10000);
 const errors=[],network=[],downloads=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
 const golden=[1,1,1,6,6,6,2,2,2,5,5,5,3,3,3,4,4,4];
 const four=[...golden,...Array(18).fill(4),...Array(18).fill(1),...Array(18).fill(6)];
 const stream=[...golden,...four,...Array((1+2+8)*18).fill(4)];
 const old=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-I'}),{type:'roll'},sequenceRng(Array(18).fill(4)));
 await page.addInitScript(({stream,oldJson})=>{
  if(!localStorage.getItem('__qa_seeded')){localStorage.clear();localStorage.setItem('__qa_seeded','yes');localStorage.setItem('dndroll.session.v1',oldJson);localStorage.setItem('dndroll.prefs.v1',JSON.stringify({locale:'zh',theme:'dark'}));}
  let i=0;window.__qaRngCalls=0;
  Object.defineProperty(crypto,'getRandomValues',{configurable:true,value:a=>{window.__qaRngCalls++;if(i>=stream.length)throw new Error('QA dice exhausted');a[0]=stream[i++]-1;return a;}});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('QA denied clipboard','NotAllowedError');}}});
 },{stream,oldJson:serializeSession(old)});
 const saved=()=>page.evaluate(()=>localStorage.getItem('dndroll.session.v1'));
 const calls=()=>page.evaluate(()=>window.__qaRngCalls);
 async function download(button) {
  const pending=page.waitForEvent('download');await button.click();const item=await pending;
  const file=path.join(out,item.suggestedFilename());await item.saveAs(file);downloads.push(item.suggestedFilename());return file;
 }
 await page.goto(pathToFileURL(path.join(root,'DNDROLL-离线版.html')).href);
 await page.getByRole('button',{name:'Dungeon Crawl Classics（DCC）',exact:true}).click();
 await page.getByRole('button',{name:/^3d6 顺序生成/}).click();
 await page.getByRole('button',{name:'开始生成',exact:true}).click();
 await page.getByRole('button',{name:'放弃并继续',exact:true}).click();
 assert.equal(await calls(),0);
 await page.getByRole('button',{name:'掷骰',exact:true}).click();
 assert.equal(await calls(),18);
 assert.deepEqual(await page.locator('.strip-cell .ability-abbr').allTextContents(),['STR','AGI','STA','PER','INT','LCK']);
 assert.deepEqual(await page.locator('.score-strip .ability-modifier').allTextContents(),['(-3)','(+3)','(-1)','(+1)','(0)','(0)']);
 await page.getByRole('button',{name:'确认完成并锁定',exact:true}).click();
 const current=await saved(),expectedSingle=applyAction(applyAction(createSession({versionId:'dcc',methodId:'dcc.3d6-in-order'}),{type:'roll'},sequenceRng(golden)),{type:'finalize'});
 assert.equal(current,serializeSession(expectedSingle));
 const historyBefore=await page.getByRole('region',{name:'最近生成',exact:true}).textContent();
 const batch=page.locator('.batch-panel');
 assert.equal(await batch.getByLabel('批量数量').inputValue(),'4');
 await batch.getByRole('button',{name:'生成批量',exact:true}).click();
 assert.equal(await calls(),90);assert.equal(await saved(),current);
 assert.equal(await page.getByRole('region',{name:'最近生成',exact:true}).textContent(),historyBefore);
 const expected=generateBatch({versionId:'dcc',methodId:'dcc.3d6-in-order'},4,sequenceRng(four));
 const files=[];
 for(let i=0;i<4;i++){
  const card=batch.getByRole('listitem',{name:`角色 #${i+1}`,exact:true});
  const abbreviations=await card.locator('.batch-scores .ability-abbr').allTextContents();
  assert.deepEqual(abbreviations,['STR','AGI','STA','PER','INT','LCK']);
  assert.equal(await card.locator('.ability-modifier').count(),6);
  const file=await download(card.getByRole('button',{name:'导出存档 JSON',exact:true}));files.push(file);
  const session=deserializeSession(await fs.readFile(file,'utf8'));
  assert.deepEqual(session,expected[i].session);assert.deepEqual(getSessionView(session),expected[i].view);
  assert.equal(validateSession(session).complete,true);
 }
 await batch.getByRole('listitem',{name:'角色 #1',exact:true}).getByText('骰子明细',{exact:true}).click();
 await batch.screenshot({animations:'disabled',path:path.join(out,'dcc-batch-dark.png')});
 await batch.getByRole('button',{name:'查看角色 #2',exact:true}).click();
 const dialog=page.getByRole('dialog');
 const text=await dialog.locator('.final-grid').textContent();assert.match(text,/人格/);assert.match(text,/幸运/);assert.doesNotMatch(text,/\b(?:DEX|CON|WIS|CHA)\b/);
 const resultFile=await download(dialog.getByRole('button',{name:'导出结果 JSON',exact:true}));
 assert.deepEqual(JSON.parse(await fs.readFile(resultFile,'utf8')).nativeScores,exportResult(expected[1].session).nativeScores);
 const txtFile=await download(dialog.getByRole('button',{name:'下载 TXT',exact:true}));
 assert.equal(await fs.readFile(txtFile,'utf8'),formatResult(expected[1].session,'zh'));
 await dialog.getByRole('button',{name:'复制结果文本',exact:true}).click();
 await dialog.getByText(/当前环境不允许直接写入剪贴板/).waitFor();
 assert.equal(await dialog.getByRole('textbox',{name:'骰子明细'}).inputValue(),formatResult(expected[1].session,'zh'));
 await dialog.getByText('完整会话 JSON（内部槽位）',{exact:true}).click();
 assert.equal(serializeSession(deserializeSession(await dialog.locator('pre').textContent())),serializeSession(expected[1].session));
 await dialog.screenshot({animations:'disabled',path:path.join(out,'dcc-session-preview.png')});
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();
 assert.equal(await saved(),current);assert.equal(await calls(),90);
 await page.getByRole('button',{name:'浅色模式',exact:true}).click();
 await batch.screenshot({animations:'disabled',path:path.join(out,'dcc-batch-light.png')});
 await page.getByRole('button',{name:'English',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await saved(),current);assert.equal(await calls(),90);
 assert.match(await batch.textContent(),/Personality/);assert.match(await batch.textContent(),/Luck/);
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
 await batch.screenshot({animations:'disabled',path:path.join(out,'dcc-batch-mobile.png')});
 await page.setViewportSize({width:1440,height:1000});
 for(const count of [1,2,8]){
  await batch.getByLabel('Batch count',{exact:true}).selectOption(String(count));
  await batch.getByRole('button',{name:'Generate batch',exact:true}).click();
  assert.equal(await batch.getByRole('listitem',{name:/^Character #/}).count(),count);
  assert.equal(await saved(),current);
 }
 assert.equal(await calls(),288);
 await batch.getByRole('button',{name:'Generate batch',exact:true}).click();
 assert.match(await batch.getByRole('alert').textContent(),/Group 1 failed/);
 assert.match(await batch.getByRole('alert').textContent(),/previous successful batch/);
 assert.equal(await batch.getByRole('listitem',{name:/^Character #/}).count(),8);
 await batch.getByRole('button',{name:'View character #2',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Use as current session',exact:true}).click();
 await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await saved(),current);
 await batch.getByRole('button',{name:'View character #2',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Use as current session',exact:true}).click();
 await page.getByRole('button',{name:'Discard and continue',exact:true}).click();
 const selected=await saved();assert.equal(selected,serializeSession(expected[1].session));
 assert.match(await page.getByRole('region',{name:'Recent groups',exact:true}).textContent(),/\(3\/10\)/);
 await page.reload();
 assert.equal(await saved(),selected);assert.equal(await calls(),0);
 assert.equal(await page.locator('.batch-entry').count(),0);
 await page.getByRole('button',{name:'Import save',exact:true}).click();
 await page.getByLabel('Choose file…').setInputFiles(files[0]);
 await page.getByRole('button',{name:'Discard and continue',exact:true}).click();
 assert.equal(await saved(),serializeSession(expected[0].session));
 assert.equal(await calls(),0);assert.equal(network.length,0);assert.equal(errors.length,0);
 const report={browser:browser.version(),offline:true,url:'file:// standalone HTML',network,errors,downloads,
 checks:['single DCC golden sequence, modifiers and native names','4 batch children equal Core and independently replay','all 1/2/4/8 presets','preview/download/copy fallback preserve autosave and history','full raw Session with explicit mapping','native result JSON and TXT','bilingual theme and names without dice consumption','390px no horizontal overflow','failed repeated generation preserves previous results with explicit error','cancel/confirm explicit restore affects only one session','reload clears batch, retains current session','current DCC file import performs no random draws']};
 await fs.writeFile(path.join(out,'batch-browser-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
} catch(error){console.error(error);process.exitCode=1;}finally {await Promise.race([browser.close(),new Promise(r=>setTimeout(r,3000))]);}
