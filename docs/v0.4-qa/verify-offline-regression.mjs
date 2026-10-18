// QA only; no runtime dependency is added to the application.
// Set PLAYWRIGHT_MODULE, CHROMIUM_MODULE, CHROMIUM_EXECUTABLE and optional FONTCONFIG_FILE.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createSession, applyAction, sequenceRng, serializeSession, deserializeSession, getSessionView, formatResult } from '../../packages/core/dist/index.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=fileURLToPath(new URL('./',import.meta.url));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const {default:bundle}=await import(process.env.CHROMIUM_MODULE);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,headless:true,
  args:bundle.args.filter(a=>!['--disable-web-security','--allow-running-insecure-content'].includes(a))});
try {
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,offline:true});
const page=await context.newPage();
page.setDefaultTimeout(10000);
const errors=[],network=[],downloads=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
let fixture=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-VI'}),{type:'roll'},sequenceRng([6,6,5,4,3,2,1]));
await page.addInitScript(json=>{localStorage.setItem('dndroll.session.v1',json);localStorage.setItem('dndroll.prefs.v1',JSON.stringify({locale:'zh',theme:'dark'}));},serializeSession(fixture));
await page.goto(pathToFileURL(path.join(root,'DNDROLL-离线版.html')).href);
await page.getByRole('button',{name:'d6 6',exact:true}).first().focus();
await page.keyboard.press('Enter');
for(let i=0;i<7;i++)await page.keyboard.press('Tab');
assert.match(await page.locator(':focus').getAttribute('aria-label'),/^STR/);
await page.keyboard.press('Space');
const firstId=getSessionView(fixture).attempt.looseDice[0].id;
fixture=applyAction(fixture,{type:'allocateDie',dieId:firstId,ability:'STR'});
assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1'))),fixture);
// Native focus moves differently after disabling a button; follow Tab to recall.
for(let i=0;i<15;i++) {
  await page.keyboard.press('Tab');
  if((await page.locator(':focus').getAttribute('aria-label'))?.startsWith('撤回骰子'))break;
}
assert.match(await page.locator(':focus').getAttribute('aria-label'),/^撤回骰子/);
await page.keyboard.press('Enter');
fixture=applyAction(fixture,{type:'allocateDie',dieId:firstId,ability:null});
assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1'))),fixture);
assert.equal(await page.locator('button button, button [role="button"]').count(),0);
// Mouse placement remains available; the Core rejects the second 6 at STR 14.
await page.getByRole('button',{name:'d6 6',exact:true}).first().click();
await page.getByRole('button',{name:/^STR/}).click();
await page.getByRole('button',{name:'d6 6',exact:true}).first().click();
await page.getByRole('button',{name:/^STR/}).click();
assert.match(await page.getByRole('alert').textContent(),/SCORE_CAP/);
assert.match(await page.getByRole('button',{name:/^STR/}).textContent(),/14/);
console.log('Keyboard and cap checks passed');
const themeRecords=[];
for(const theme of ['dark','light']) {
  if(theme==='light')await page.getByRole('button',{name:'浅色模式',exact:true}).click();
  await page.getByRole('button',{name:/^DEX/}).focus();
  await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  await page.screenshot({animations:'disabled',path:path.join(out,`${theme}-allocation.png`),fullPage:true});
  // Reproducible CSS state fixture: all samples use shipped class names/styles.
  const records=await page.evaluate(()=>{
    const holder=document.createElement('section');holder.className='panel';holder.id='qa-theme-states';
    holder.innerHTML='<h2>Theme state QA · 配色验收</h2><button class="btn btn-primary">主操作 / Primary</button> <button class="btn btn-danger">删除 / Danger</button><p class="issue issue-error">错误 / Error</p><p class="issue issue-warning">警告 / Warning</p><p class="banner banner-info">通知 / Success</p><button class="candidate chosen">选中候选 / Selected</button>';
    document.querySelector('.workspace').append(holder);
    const parse=s=>s.match(/[\d.]+/g).map(Number);
    const blend=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
    const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    return [...holder.querySelectorAll('button,p')].map(el=>{
      const styles=getComputedStyle(el),anc=[];let p=el;
      while(p){anc.push(p);p=p.parentElement;}
      let bg=[255,255,255];for(const n of anc.reverse())bg=blend(parse(getComputedStyle(n).backgroundColor),bg);
      const fg=blend(parse(styles.color),bg);const a=lum(fg),b=lum(bg);
      return {class:el.className,foreground:fg,background:bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
    });
  });
  records.forEach(r=>assert.ok(r.ratio>=4.5,`${theme} ${r.class}: ${r.ratio}`));
  themeRecords.push({theme,records});
  await page.locator('#qa-theme-states').screenshot({animations:'disabled',path:path.join(out,`${theme}-states.png`)});
  await page.locator('#qa-theme-states').evaluate(el=>el.remove());
}
console.log('Theme screenshots and contrast passed');
const saved=await page.evaluate(()=>localStorage.getItem('dndroll.session.v1'));
await page.getByRole('button',{name:'English',exact:true}).click();
assert.equal(await page.locator('html').getAttribute('lang'),'en');
assert.equal(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1')),saved);
await page.getByRole('button',{name:/^Method IX:/}).click();
const desc=page.locator('.method-card.active .method-desc');
assert.equal(await desc.evaluate(el=>getComputedStyle(el).webkitLineClamp),'none');
assert.ok(await desc.evaluate(el=>el.scrollHeight<=el.clientHeight));
assert.equal(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1')),saved);
await page.setViewportSize({width:390,height:844});
await page.screenshot({animations:'disabled',path:path.join(out,'light-mobile-method.png'),fullPage:true});
await page.setViewportSize({width:1440,height:1000});
// Export the current Session and import the actual downloaded JSON file.
async function download(button) {
  const pending=page.waitForEvent('download');await button.click();const d=await pending;
  const p=path.join(out,d.suggestedFilename());await d.saveAs(p);downloads.push(d.suggestedFilename());return p;
}
console.log('Language and description checks passed');
const jsonFile=await download(page.getByRole('button',{name:'Export save JSON',exact:true}));
assert.equal(serializeSession(deserializeSession(await fs.readFile(jsonFile,'utf8'))),saved);
await page.getByRole('button',{name:'Import save',exact:true}).click();
assert.equal(await page.getByRole('button',{name:'Close',exact:true}).count(),1);
await page.getByRole('textbox').fill(await fs.readFile(jsonFile,'utf8'));
await page.getByRole('button',{name:'Validate and restore',exact:true}).click();
// Existing session triggers discard confirmation.
const discard=page.getByRole('button',{name:'Discard and continue',exact:true});if(await discard.count())await discard.click();
assert.equal(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1')),saved);
await page.getByRole('button',{name:'中文',exact:true}).click();
assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
console.log('Session paste roundtrip passed');
// Build a current-version completed session for TXT and result JSON exports.
let complete=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-I'}),{type:'roll'},sequenceRng(Array(18).fill(4)));
complete=applyAction(complete,{type:'finalize'});
await page.getByRole('button',{name:'导入存档',exact:true}).click();
await page.getByRole('textbox').fill(serializeSession(complete));
await page.getByRole('button',{name:'校验并恢复',exact:true}).click();
const confirm=page.getByRole('button',{name:'放弃并继续',exact:true});if(await confirm.count())await confirm.click();
assert.match(await page.locator('.final-grid').textContent(),/灵知/);
const txtFile=await download(page.getByRole('button',{name:'下载 TXT',exact:true}));
assert.equal(await fs.readFile(txtFile,'utf8'),formatResult(complete,'zh'));
await download(page.getByRole('button',{name:'导出结果 JSON',exact:true}));
await page.getByRole('button',{name:'显示可选中文本',exact:true}).click();
assert.equal(await page.getByRole('textbox',{name:'骰子明细'}).inputValue(),formatResult(complete,'zh'));
console.log('TXT/result JSON exports passed');
// JSON file-input import is also exercised (TXT is an output, never a save format).
await page.getByRole('button',{name:'导入存档',exact:true}).click();
await page.getByRole('button',{name:'关闭',exact:true}).click();
await page.getByRole('button',{name:'导入存档',exact:true}).click();
await page.getByLabel('选择文件…').setInputFiles(jsonFile);
const fileConfirm=page.getByRole('button',{name:'放弃并继续',exact:true});await fileConfirm.waitFor();await fileConfirm.click();
assert.equal(await page.evaluate(()=>localStorage.getItem('dndroll.session.v1')),saved);
assert.equal(errors.length,0);assert.equal(network.length,0);
const report={browser:browser.version(),url:'file:// (root standalone HTML)',offline:true,network,errors,downloads,themeRecords,
 checks:['native Tab/Enter/Space placement and recall','Core fixed-sequence equality','SCORE_CAP retains state','no nested controls','dark/light states and computed contrast','zh/en document language','expanded English method text','browsing leaves save unchanged','390px layout','Session JSON download/import replay','TXT download/selectable copy source','result JSON download']};
await fs.writeFile(path.join(out,'browser-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
} catch(error) { console.error(error); process.exitCode=1; } finally {
 await Promise.race([browser.close(),new Promise(resolve=>setTimeout(resolve,3000))]);
}
