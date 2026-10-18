import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { applyAction, createSession, sequenceRng, serializeSession } from '@dndroll/core';
import App from '../App';
function chooseDcc() {
 fireEvent.click(screen.getByRole('button',{name:'Dungeon Crawl Classics（DCC）'}));
 fireEvent.click(screen.getByRole('button',{name:/^3d6 顺序生成/}));
}
it('V4-05 batch defaults to four; independent from autosave/history under StrictMode and language changes',()=>{
 let saved=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-I'}),{type:'roll'},sequenceRng(Array(18).fill(4)));
 localStorage.setItem('dndroll.session.v1',serializeSession(saved));
 render(<StrictMode><App rng={sequenceRng(Array(72).fill(4))}/></StrictMode>);
 const history=screen.getByRole('region',{name:'最近生成'}).textContent;
 chooseDcc();
 expect((screen.getByLabelText('批量数量') as HTMLSelectElement).value).toBe('4');
 expect(within(screen.getByLabelText('批量数量')).getAllByRole('option').map(o=>o.textContent)).toEqual(['1','2','4','8']);
 fireEvent.click(screen.getByRole('button',{name:'生成批量'}));
 expect(screen.getByText('本批量：4 组')).toBeTruthy();
 expect(localStorage.getItem('dndroll.session.v1')).toBe(serializeSession(saved));
 expect(screen.getByRole('region',{name:'最近生成'}).textContent).toBe(history);
 fireEvent.click(screen.getByRole('button',{name:'English'}));
 expect(screen.getByText('This batch: 4 groups')).toBeTruthy();
 expect(localStorage.getItem('dndroll.session.v1')).toBe(serializeSession(saved));
 fireEvent.click(screen.getByRole('button',{name:'Generate batch'})); // Stream exhausted: no fake new success.
 expect(screen.getByRole('alert').textContent).toContain('Group 1 failed');
 expect(screen.getByRole('alert').textContent).toContain('previous successful batch');
 expect(screen.getByText('This batch: 4 groups')).toBeTruthy();
});
it('V4-05 pending decisions hide batch controls; PF1 classic requires explicit in-order option',()=>{
 render(<App/>);
 fireEvent.click(screen.getByRole('button',{name:'D&D 5E（2024）'}));
 fireEvent.click(screen.getByRole('button',{name:/随机生成/}));
 expect(screen.queryByRole('button',{name:'生成批量'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Pathfinder 第一版'}));
 fireEvent.click(screen.getByRole('button',{name:/^经典/}));
 expect(screen.queryByRole('button',{name:'生成批量'})).toBeNull();
 fireEvent.click(screen.getByRole('switch'));
 expect(screen.getByRole('button',{name:'生成批量'})).toBeTruthy();
 fireEvent.click(screen.getByRole('switch'));
 expect(screen.queryByRole('button',{name:'生成批量'})).toBeNull();
});

import { waitFor } from '@testing-library/react';
import { deserializeSession, formatResult, getSessionView } from '@dndroll/core';

it.each([1,2,8])('V4-06 UI count %i displays exactly that many independently inspectable results',(count)=>{
 render(<StrictMode><App rng={sequenceRng(Array(count*18).fill(4))}/></StrictMode>);
 chooseDcc();fireEvent.change(screen.getByLabelText('批量数量'),{target:{value:String(count)}});
 fireEvent.click(screen.getByRole('button',{name:'生成批量'}));
 const batch=screen.getByRole('region',{name:'批量属性生成'});
 const items=within(batch).getAllByRole('listitem',{name:/^角色 #/});
 expect(items.length).toBe(count);
 expect([...items[0]!.querySelectorAll('.ability-abbr')].slice(0,6).map(el=>el.textContent)).toEqual(['STR','AGI','STA','PER','INT','LCK']);
 expect(items[0]!.querySelectorAll('.ability-modifier').length).toBe(6);
 expect(localStorage.getItem('dndroll.session.v1')).toBeNull();
 expect(screen.queryByRole('region',{name:'最近生成'})).toBeNull();
 fireEvent.click(within(items[0]!).getByText('骰子明细'));
 expect(items[0]!.querySelector('details')?.open).toBe(true);
 expect(items[0]!.querySelectorAll('svg.die').length).toBe(18);
});

it('V4-06 preview/copy/raw JSON leave autosave alone; only confirmed use restores one group',async()=>{
 const old=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-I'}),{type:'roll'},sequenceRng(Array(18).fill(4)));
 const oldJson=serializeSession(old);
 localStorage.setItem('dndroll.session.v1',oldJson);
 const first=render(<App rng={sequenceRng([2,3,4,5].flatMap(n=>Array(18).fill(n)))}/>);
 chooseDcc();fireEvent.click(screen.getByRole('button',{name:'生成批量'}));
 const history=screen.getByRole('region',{name:'最近生成'}).textContent;
 fireEvent.click(screen.getByRole('button',{name:'查看角色 #2'}));
 let dialog=screen.getByRole('dialog');
 fireEvent.click(within(dialog).getByText('完整会话 JSON（内部槽位）'));
 const batchJson=serializeSession(deserializeSession(dialog.querySelector('pre')!.textContent!));
 const child=deserializeSession(batchJson);
 expect(getSessionView(child).attempt.scores.STR).toBe(9);
 expect(dialog.textContent).toContain('WIS → PER');
 const descriptor=Object.getOwnPropertyDescriptor(navigator,'clipboard');
 let copied='';
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{copied=text;}}});
 try {
  fireEvent.click(within(dialog).getByRole('button',{name:'复制结果文本'}));
  await waitFor(()=>expect(copied).toBe(formatResult(child,'zh')));
  expect(copied).toContain('PER 9 (0)');expect(copied).not.toMatch(/\bCHA\b/);
 } finally {
  if(descriptor)Object.defineProperty(navigator,'clipboard',descriptor);else Reflect.deleteProperty(navigator,'clipboard');
 }
 expect(localStorage.getItem('dndroll.session.v1')).toBe(oldJson);
 expect(screen.getByRole('region',{name:'最近生成'}).textContent).toBe(history);
 fireEvent.click(within(dialog).getByRole('button',{name:'设为当前会话'}));
 expect(screen.getByRole('dialog',{name:'放弃当前进度？'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'取消'}));
 expect(localStorage.getItem('dndroll.session.v1')).toBe(oldJson);
 fireEvent.click(screen.getByRole('button',{name:'查看角色 #2'}));
 fireEvent.click(within(screen.getByRole('dialog')).getByRole('button',{name:'设为当前会话'}));
 fireEvent.click(screen.getByRole('button',{name:'放弃并继续'}));
 expect(localStorage.getItem('dndroll.session.v1')).toBe(batchJson);
 expect(screen.getByRole('region',{name:'最近生成'}).textContent).toContain('(2/10)');
 expect(screen.getByText('本批量：4 组')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'English'}));
 expect(screen.getByText('This batch: 4 groups')).toBeTruthy();
 expect(localStorage.getItem('dndroll.session.v1')).toBe(batchJson);
 first.unmount();render(<App/>);
 expect(screen.queryByText('This batch: 4 groups')).toBeNull();
 expect(localStorage.getItem('dndroll.session.v1')).toBe(batchJson);
});
