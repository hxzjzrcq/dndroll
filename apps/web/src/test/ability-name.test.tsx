import { fireEvent, render, screen, within } from '@testing-library/react';
import { applyAction, createSession, deserializeSession, formatResult, listVersions, sequenceRng, serializeSession, type VersionId } from '@dndroll/core';
import { getAbilityName } from '../i18n';
import { AbilityName } from '../components/common';
import App from '../App';

it('V3-07: only 2E Chinese Wisdom changes; every other edition and English remain scoped',()=>{
  for(const version of listVersions().filter(v=>v.id!=='dcc')) {
    expect(getAbilityName(version.id,'WIS','zh')).toBe(version.id==='adnd2e'?'灵知':'感知');
    expect(getAbilityName(version.id,'WIS','en')).toBe('Wisdom');
    expect(getAbilityName(version.id,'STR','zh')).toBe('力量');
  }
  const {rerender}=render(<AbilityName versionId="adnd2e" ability="WIS" locale="zh"/>);
  expect(screen.getByText('WIS')).toBeTruthy();expect(screen.getByText('灵知')).toBeTruthy();
  rerender(<AbilityName versionId="adnd1e" ability="WIS" locale="zh"/>);
  expect(screen.getByText('感知')).toBeTruthy();
});

it.each([['adnd2e','adnd2e.phb-I','灵知'],['adnd1e','adnd1e.dmg-I','感知']] as const)('V3-07: %s scores, history, completed result and copied TXT keep the right scope', (version,method,label)=>{
  let s=applyAction(createSession({versionId:version as VersionId,methodId:method}),{type:'roll'},sequenceRng(Array(24).fill(4)));
  if(version==='adnd1e') s=applyAction(s,{type:'assign',assignments:Object.fromEntries(['STR','INT','WIS','DEX','CON','CHA'].map((ab,i)=>[ab,`a1.r${i+1}`]))});
  localStorage.setItem('dndroll.session.v1',serializeSession(s));
  render(<App/>);
  expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  const before=localStorage.getItem('dndroll.session.v1');
  fireEvent.click(screen.getByRole('button',{name:'English'}));
  expect(screen.getAllByText('Wisdom').length).toBeGreaterThan(0);
  expect(localStorage.getItem('dndroll.session.v1')).toBe(before);
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  fireEvent.click(screen.getByRole('button',{name:'确认完成并锁定'}));
  expect(document.querySelector('.final-grid')?.textContent).toContain(label);
  const saved=localStorage.getItem('dndroll.session.v1')!;
  const restored=deserializeSession(saved);
  expect(serializeSession(restored)).toBe(saved);
  // Existing TXT/copy/history use stable abbreviations, not full translated names.
  expect(formatResult(restored,'zh')).toContain('WIS 12');
  expect(formatResult(restored,'zh')).not.toMatch(/感知|灵知/);
  expect(within(screen.getByRole('region',{name:'最近生成'})).getByText(/WIS 12/)).toBeTruthy();
});

it('V3-07: method VI uses the scoped name without altering the Session',()=>{
  const s=applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-VI'}),{type:'roll'},sequenceRng([6,5,4,3,2,1,1]));
  localStorage.setItem('dndroll.session.v1',serializeSession(s));
  render(<App/>);
  expect(screen.getByRole('button',{name:/^WIS/}).textContent).toContain('灵知');
  expect(localStorage.getItem('dndroll.session.v1')).toBe(serializeSession(s));
});
