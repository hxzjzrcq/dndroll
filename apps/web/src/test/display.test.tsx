import { fireEvent, render, screen, within } from '@testing-library/react';
import { applyAction, createSession, getSessionView, sequenceRng } from '@dndroll/core';
import App from '../App';
import { historyLines } from '../components/HistoryPreview';

it('历史显示依序数值，并明确标注未分配候选与属性位置', () => {
  const rng = sequenceRng(Array(24).fill(4));
  let s = createSession({ versionId: 'adnd2e', methodId: 'adnd2e.phb-I' });
  s = applyAction(s, { type: 'roll' }, rng);
  expect(historyLines(getSessionView(s), 'zh')).toEqual(['当前属性: STR 12 · DEX 12 · CON 12 · INT 12 · WIS 12 · CHA 12']);
  let a = createSession({ versionId: 'dnd5e2024', methodId: 'dnd5e2024.roll' });
  a = applyAction(a, { type: 'roll' }, sequenceRng(Array(24).fill(4)));
  expect(historyLines(getSessionView(a), 'en')).toEqual(['Candidates: 12 / 12 / 12 / 12 / 12 / 12']);
  a = applyAction(a, { type: 'assign', assignments: { DEX: 'a1.r1' } });
  expect(historyLines(getSessionView(a), 'zh')[1]).toContain('STR — · DEX 12');
});

it('二选一按属性列出两个候选；分骰列出原始七骰', () => {
  let s = createSession({ versionId: 'adnd2e', methodId: 'adnd2e.phb-II' });
  s = applyAction(s, { type: 'roll' }, sequenceRng(Array(36).fill(4)));
  expect(historyLines(getSessionView(s), 'zh')[0]).toContain('STR [12 / 12]');
  s = createSession({ versionId: 'adnd2e', methodId: 'adnd2e.phb-VI' });
  s = applyAction(s, { type: 'roll' }, sequenceRng([1, 2, 3, 4, 5, 6, 1]));
  expect(historyLines(getSessionView(s), 'zh')[0]).toBe('七颗骰: 1 / 2 / 3 / 4 / 5 / 6 / 1');
});

it('十二套预览逐套分行，不混成一组；选择标记跟随真实会话', () => {
  let s = createSession({ versionId: 'adnd1e', methodId: 'adnd1e.dmg-IV' });
  s = applyAction(s, { type: 'roll' }, sequenceRng(Array(216).fill(4)));
  expect(historyLines(getSessionView(s), 'zh')).toHaveLength(12);
  s = applyAction(s, { type: 'chooseSet', setId: 'a1.set3' });
  expect(historyLines(getSessionView(s), 'zh')[2]).toBe('第 3 套 ✓: 12 / 12 / 12 / 12 / 12 / 12');
});

it('浅深色一键切换并记住偏好，不更改骰值、会话或历史；快速按钮位于工作面板附近', () => {
  const first = render(<App rng={sequenceRng(Array(24).fill(4))} />);
  fireEvent.click(screen.getByRole('button', { name: 'D&D 5E（2024）' }));
  fireEvent.click(screen.getByRole('button', { name: /随机生成/ }));
  fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
  fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
  const saved = localStorage.getItem('dndroll.session.v1');
  const history = screen.getByRole('region', { name: '最近生成' }).textContent;
  const bar = screen.getByRole('region', { name: '快速掷骰' });
  expect(within(bar).getByRole('button', { name: '再掷一组' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: '浅色模式' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
  expect(screen.getByRole('region', { name: '最近生成' }).textContent).toBe(history);
  first.unmount();
  render(<App rng={sequenceRng([])} />);
  expect(document.documentElement.dataset.theme).toBe('light');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
});
