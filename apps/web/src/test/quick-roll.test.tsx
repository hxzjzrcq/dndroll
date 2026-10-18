import { StrictMode } from 'react';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { getSessionView, listMethods, listVersions, sequenceRng, serializeSession } from '@dndroll/core';
import App from '../App';
import { useSessionController } from '../store';

const methods = listVersions().flatMap(v => listMethods(v.id)).filter(m => m.status === 'ready' && !['buy', 'array'].includes(m.mode));
const dice = () => sequenceRng(Array(20000).fill(4));
const wrapper = ({ children }: { children: React.ReactNode }) => <StrictMode>{children}</StrictMode>;

describe('快速生成控制器', () => {
  it.each(methods)('$id：新组、原组恢复与语言无关的完整会话快照', m => {
    const rng = dice();
    const { result } = renderHook(() => useSessionController(rng), { wrapper });
    act(() => { result.current.start({ versionId: m.versionId, methodId: m.id }); });
    if (m.mode === 'pool') act(() => { result.current.run({ type: 'setPool', counts: { STR: 4, DEX: 4, CON: 4, INT: 4, WIS: 4, CHA: 4 } }); });
    act(() => { result.current.run({ type: 'roll' }); });
    const before = serializeSession(result.current.session!);
    const id = result.current.activeHistoryId!;
    act(() => { expect(result.current.nextGroup()).toBe(true); });
    expect(result.current.history).toHaveLength(2);
    expect(result.current.activeHistoryId).not.toBe(id);
    expect(result.current.session!.request).toEqual(JSON.parse(before).request);
    expect(getSessionView(result.current.session!).attempt.generated).toBe(true);
    act(() => { result.current.restoreGroup(id); });
    expect(serializeSession(result.current.session!)).toBe(before);
    expect(localStorage.getItem('dndroll.session.v1')).toBe(before);
  });

  it('只保留最近十组；恢复后编辑更新原条目，不生成重复条目；刷新只恢复当前存档', () => {
    const rng = dice();
    const { result, unmount } = renderHook(() => useSessionController(rng));
    act(() => { result.current.start({ versionId: 'dnd5e2024', methodId: 'dnd5e2024.roll' }); });
    act(() => { result.current.run({ type: 'roll' }); });
    const oldest = result.current.activeHistoryId;
    for (let i = 0; i < 10; i++) act(() => { result.current.nextGroup(); });
    expect(result.current.history).toHaveLength(10);
    expect(result.current.history.some(h => h.id === oldest)).toBe(false);
    const id = result.current.history[0]!.id;
    act(() => { result.current.restoreGroup(id); });
    act(() => { result.current.run({ type: 'assign', assignments: { STR: 'a1.r1' } }); });
    expect(result.current.history).toHaveLength(10);
    expect(getSessionView(result.current.history.find(h => h.id === id)!.session).attempt.assignments.STR).toBe('a1.r1');
    const saved = localStorage.getItem('dndroll.session.v1');
    expect(Object.keys(localStorage)).toEqual(['dndroll.session.v1']);
    unmount();
    const reopened = renderHook(() => useSessionController(sequenceRng([])));
    expect(reopened.result.current.history).toHaveLength(1);
    expect(serializeSession(reopened.result.current.session!)).toBe(saved);
  });

  it('StrictMode 每次仅消耗一组随机数，恢复不消耗随机数', () => {
    let calls = 0;
    const rng = (sides: number) => { calls++; return sides === 6 ? 4 : 1; };
    const { result } = renderHook(() => useSessionController(rng), { wrapper });
    act(() => { result.current.start({ versionId: 'dnd5e2024', methodId: 'dnd5e2024.roll' }); });
    expect(calls).toBe(0);
    act(() => { result.current.run({ type: 'roll' }); });
    expect(calls).toBe(24);
    const first = result.current.activeHistoryId!;
    act(() => { result.current.nextGroup(); });
    expect(calls).toBe(48);
    act(() => { result.current.restoreGroup(first); });
    expect(calls).toBe(48);
  });

  it('PF1 保留 28 颗及每项已确认骰数，而非未确认草稿', () => {
    const rng = dice();
    const { result } = renderHook(() => useSessionController(rng));
    act(() => { result.current.start({ versionId: 'pf1', methodId: 'pf1.dice-pool', options: { poolTotal: 28 } }); });
    const counts = { STR: 8, DEX: 4, CON: 4, INT: 4, WIS: 4, CHA: 4 };
    act(() => { result.current.run({ type: 'setPool', counts }); });
    act(() => { result.current.run({ type: 'roll' }); });
    act(() => { result.current.nextGroup(); });
    expect(result.current.session!.request.options!.poolTotal).toBe(28);
    expect(result.current.view!.attempt.poolCounts).toEqual(counts);
  });

  it('新组生成失败时保留原会话、历史及存档', () => {
    const rng = sequenceRng(Array(24).fill(4));
    const { result } = renderHook(() => useSessionController(rng));
    act(() => { result.current.start({ versionId: 'dnd5e2024', methodId: 'dnd5e2024.roll' }); });
    act(() => { result.current.run({ type: 'roll' }); });
    const before = result.current.session;
    const saved = localStorage.getItem('dndroll.session.v1');
    act(() => { expect(result.current.nextGroup()).toBe(false); });
    expect(result.current.session).toBe(before);
    expect(result.current.history).toHaveLength(1);
    expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
  });
});

it('界面：连续生成无确认；恢复分配与锁定状态；切语言不重掷且重置面板临时选择', () => {
  render(<StrictMode><App rng={dice()} /></StrictMode>);
  fireEvent.click(screen.getByRole('button', { name: 'D&D 5E（2024）' }));
  fireEvent.click(screen.getByRole('button', { name: /随机生成/ }));
  fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
  fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
  const candidate = () => within(screen.getByRole('group', { name: '候选结果' })).getAllByRole('button')[0]!;
  fireEvent.click(candidate());
  fireEvent.click(screen.getByRole('button', { name: '再掷一组' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  // A picked candidate from the previous group must not carry into this group.
  fireEvent.click(within(screen.getByRole('group', { name: '属性' })).getByRole('button', { name: /^STR/ }));
  expect(JSON.parse(localStorage.getItem('dndroll.session.v1')!).events).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /^第 2 组/ }));
  for (const ab of ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']) {
    const pool = within(screen.getByRole('group', { name: '候选结果' })).getAllByRole('button').filter(b => !b.className.includes('used'));
    fireEvent.click(pool[0]!);
    fireEvent.click(within(screen.getByRole('group', { name: '属性' })).getByRole('button', { name: new RegExp(`^${ab}`) }));
  }
  fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
  const locked = localStorage.getItem('dndroll.session.v1');
  fireEvent.click(screen.getByRole('button', { name: '再掷一组' }));
  fireEvent.click(screen.getByRole('button', { name: /^第 2 组/ }));
  expect(screen.getByText('属性生成结果')).toBeTruthy();
  expect(localStorage.getItem('dndroll.session.v1')).toBe(locked);
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(localStorage.getItem('dndroll.session.v1')).toBe(locked);
  expect(screen.getByRole('button', { name: 'Roll another group' })).toBeTruthy();
});

it.each(['dnd5e2024.point-buy', 'dnd5e2024.array'])('非随机方法 %s 不提供快速生成', methodId => {
  const { result } = renderHook(() => useSessionController(dice()));
  act(() => { result.current.start({ versionId: 'dnd5e2024', methodId }); });
  act(() => { expect(result.current.nextGroup()).toBe(false); });
  expect(result.current.history).toHaveLength(0);
});
