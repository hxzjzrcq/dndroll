import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { applyAction, createSession, getSessionView, sequenceRng, type Action, type Session } from '@dndroll/core';
import { AllocatePanel } from '../components/panels';

it('V3-01: real sibling buttons support Tab, Enter and Space without changing Core events', async () => {
  const initial = applyAction(createSession({versionId:'adnd2e',methodId:'adnd2e.phb-VI'}), {type:'roll'}, sequenceRng([6,5,4,3,2,1,1]));
  let actual: Session = initial;
  function Harness() {
    const [session, setSession] = useState(initial);
    return <AllocatePanel view={getSessionView(session)} locale="zh" run={(action:Action) => {
      actual=applyAction(session,action); setSession(actual); return true;
    }}/>;
  }
  const {container}=render(<Harness/>);
  expect(container.querySelector('button button, button [role="button"]')).toBeNull();
  const user=userEvent.setup();
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('button',{name:'d6 6'}));
  await user.keyboard('{Enter}');
  // The seven dice are followed by the first placement button in Tab order.
  for(let i=0;i<7;i++) await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('button',{name:/^STR/}));
  await user.keyboard(' ');
  const dieId=getSessionView(initial).attempt.looseDice[0]!.id;
  let expected=applyAction(initial,{type:'allocateDie',dieId,ability:'STR'});
  expect(actual).toEqual(expected);
  expect(screen.getByRole('button',{name:/^STR/}).textContent).toContain('14');
  const recall=screen.getByRole('button',{name:/^撤回骰子/});
  for(let i=0;i<8 && document.activeElement!==recall;i++) await user.tab();
  expect(document.activeElement).toBe(recall);
  await user.keyboard('{Enter}');
  expected=applyAction(expected,{type:'allocateDie',dieId,ability:null});
  expect(actual).toEqual(expected);
  expect(container.querySelector('button button, button [role="button"]')).toBeNull();
});

import App from '../App';
import { DieFace } from '../components/DieFace';
import { Modal } from '../components/common';

it('V3-03: modal and dropped dice take an explicit locale',()=>{
  const {rerender}=render(<><Modal title="测试" locale="zh" onClose={()=>{}}><DieFace value={1} dropped locale="zh"/></Modal></>);
  expect(screen.getByRole('button',{name:'关闭'})).toBeTruthy();
  expect(screen.getByRole('img',{name:'d6 1 (舍弃)'})).toBeTruthy();
  rerender(<Modal title="Test" locale="en" onClose={()=>{}}><DieFace value={1} dropped locale="en"/></Modal>);
  expect(screen.getByRole('button',{name:'Close'})).toBeTruthy();
  expect(screen.getByRole('img',{name:'d6 1 (dropped)'})).toBeTruthy();
});

it('V3-03: language updates html.lang and dice labels without changing the session',()=>{
  render(<App rng={sequenceRng(Array(24).fill(3))}/>);
  fireEvent.click(screen.getByRole('button',{name:'D&D 5E（2024）'}));
  fireEvent.click(screen.getByRole('button',{name:/随机生成/}));
  fireEvent.click(screen.getByRole('button',{name:'开始生成'}));
  fireEvent.click(screen.getByRole('button',{name:'掷骰'}));
  const saved=localStorage.getItem('dndroll.session.v1');
  expect(document.documentElement.lang).toBe('zh-CN');
  expect(screen.getAllByRole('img',{name:'d6 3 (舍弃)'}).length).toBe(6);
  fireEvent.click(screen.getByRole('button',{name:'English'}));
  expect(document.documentElement.lang).toBe('en');
  expect(screen.getAllByRole('img',{name:'d6 3 (dropped)'}).length).toBe(6);
  expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  expect(document.documentElement.lang).toBe('zh-CN');
  expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
});

it('V3-06: selected cards contain the full bilingual description without starting or replacing a session',()=>{
  render(<App rng={sequenceRng(Array(18).fill(4))}/>);
  fireEvent.click(screen.getByRole('button',{name:'AD&D 第二版'}));
  fireEvent.click(screen.getByRole('button',{name:/^方法 IX：/}));
  expect(document.querySelector('.method-card.active .method-desc')?.textContent).toBe(getSessionView(createSession({versionId:'adnd2e',methodId:'adnd2e.sp-IX'})).method.description.zh);
  expect(localStorage.getItem('dndroll.session.v1')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:/^方法 I：/}));
  fireEvent.click(screen.getByRole('button',{name:'开始生成'}));
  fireEvent.click(screen.getByRole('button',{name:'掷骰'}));
  const saved=localStorage.getItem('dndroll.session.v1');
  fireEvent.click(screen.getByRole('button',{name:/^方法 IX：/}));
  fireEvent.click(screen.getByRole('button',{name:'English'}));
  const description=getSessionView(createSession({versionId:'adnd2e',methodId:'adnd2e.sp-IX'})).method.description.en;
  expect(document.querySelector('.method-card.active .method-desc')?.textContent).toBe(description);
  expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
  expect(document.querySelector('.method-card button, .method-card [role="button"]')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'AD&D 1E'}));
  expect((screen.getByRole('button',{name:/UA Method V/}) as HTMLButtonElement).disabled).toBe(true);
});
