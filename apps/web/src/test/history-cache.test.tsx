import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import * as core from '@dndroll/core';
import { getHistoryView } from '../historyView';
import { HistoryPreview } from '../components/HistoryPreview';
import App from '../App';

it('V3-04: unchanged identities replay once, updates invalidate, restoring reuses the old view',()=>{
  const session=core.applyAction(core.createSession({versionId:'adnd2e',methodId:'adnd2e.phb-VI'}),{type:'roll'},core.sequenceRng([6,5,4,3,2,1,1]));
  const spy=vi.spyOn(core,'getSessionView');
  try {
    const before=JSON.stringify(session);
    const first=getHistoryView(session);
    expect(getHistoryView(session)).toBe(first);
    expect(spy).toHaveBeenCalledTimes(1);
    const {rerender}=render(<HistoryPreview view={getHistoryView(session)} locale="zh"/>);
    expect(screen.getByText(/七颗骰/)).toBeTruthy();
    rerender(<HistoryPreview view={getHistoryView(session)} locale="en"/>);
    expect(screen.getByText(/Seven dice/)).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    const updated=core.applyAction(session,{type:'allocateDie',dieId:first.attempt.looseDice[0]!.id,ability:'STR'});
    expect(getHistoryView(updated).attempt.scores.STR).toBe(14);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(getHistoryView(session)).toBe(first);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(session)).toBe(before);
  } finally {spy.mockRestore();}
});

it('V3-04: browsing and language rerenders reuse each history Session',()=>{
  render(<App rng={core.sequenceRng(Array(60).fill(4))}/>);
  fireEvent.click(screen.getByRole('button',{name:'AD&D 第二版'}));
  fireEvent.click(screen.getByRole('button',{name:/^方法 I：/}));
  fireEvent.click(screen.getByRole('button',{name:'开始生成'}));
  fireEvent.click(screen.getByRole('button',{name:'掷骰'}));
  fireEvent.click(screen.getByRole('button',{name:'再掷一组'}));
  const spy=vi.spyOn(core,'getSessionView');
  try {
    fireEvent.click(screen.getByRole('button',{name:'English'}));
    fireEvent.click(screen.getByRole('button',{name:'D&D 3.5'}));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole('region',{name:'Recent groups'}).textContent).toContain('Current abilities');
  } finally {spy.mockRestore();}
});
