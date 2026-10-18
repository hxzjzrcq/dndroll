import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { sequenceRng } from '@dndroll/core';
import App from '../App';

const saved = () => JSON.parse(localStorage.getItem('dndroll.session.v1')!);
function start(method: RegExp, dice: number[]) {
  render(<StrictMode><App rng={sequenceRng(dice)} /></StrictMode>);
  fireEvent.click(screen.getByRole('button', { name: 'AD&D 第二版' }));
  fireEvent.click(screen.getByRole('button', { name: method }));
  fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
}
function increase(ab: string, n: number) {
  for (let i = 0; i < n; i++) fireEvent.click(screen.getByRole('button', { name: `${ab} +1` }));
}

it('VII 点满 75 后手动投 d100，历史/切语言不重投，结果显示 18/00', () => {
  start(/^方法 VII：/, [100]);
  for (const [ab,n] of Object.entries({STR:15,DEX:12,CON:9,INT:7,WIS:7,CHA:7})) increase(ab,n);
  expect(saved().events.every((e: any) => e.dice.length === 0)).toBe(true);
  expect(screen.queryByRole('button', { name: '确认完成并锁定' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '投掷传奇力量（d100）' }));
  expect(saved().events.at(-1).dice).toEqual([100]);
  const json = localStorage.getItem('dndroll.session.v1');
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(localStorage.getItem('dndroll.session.v1')).toBe(json);
  fireEvent.click(screen.getByRole('button', { name: '中文' }));
  fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
  expect(document.querySelector('.final-score')!.textContent).toBe('18/00');
});

it('VIII 每项最多 6 骰；确认后掷骰，STR 18 自动附加 d100，并可快速生成下一组', () => {
  start(/^方法 VIII：/, [...Array(24).fill(6),65,...Array(24).fill(4)]);
  increase('STR',3); // 3 → 6，按钮到顶
  expect((screen.getByRole('button', { name:'STR +1' }) as HTMLButtonElement).disabled).toBe(true);
  for (const ab of ['DEX','CON','INT']) increase(ab,1);
  fireEvent.click(screen.getByRole('button', { name:'确认骰数配置' }));
  fireEvent.click(screen.getByRole('button', { name:'掷骰' }));
  expect(saved().events.at(-1)).toEqual({action:{type:'rollExceptional'},dice:[65]});
  expect(screen.getAllByText(/18\/65/).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name:'再掷一组' }));
  expect(saved().events[0].action.counts.STR).toBe(6);
  expect(saved().events.filter((e:any)=>e.action.type==='rollExceptional')).toHaveLength(0);
  expect(screen.getByRole('region', {name:'最近生成'}).textContent).toContain('18/65');
});

it('IX 先投预算，再按对应上限购点；再掷一组独立生成预算，历史保留旧预算', () => {
  start(/^方法 IX：/, [6,6,1,1,51]);
  expect(screen.queryByRole('button', {name:'STR +1'})).toBeNull();
  fireEvent.click(screen.getByRole('button', {name:'掷骰'}));
  increase('STR',12);expect((screen.getByRole('button', {name:'STR +1'}) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByText(/2d6: 6 \+ 6/).textContent).toContain('80');
  fireEvent.click(screen.getByRole('button', {name:'再掷一组'}));
  expect(screen.getByText(/2d6: 1 \+ 1/).textContent).toContain('68');
  increase('STR',15);fireEvent.click(screen.getByRole('button', {name:'投掷传奇力量（d100）'}));
  expect(saved().events.at(-1).dice).toEqual([51]);
  expect(screen.getByRole('region', {name:'最近生成'}).textContent).toContain('预算 80');
});

it('X 传奇力量购买计入同一预算，不提供百分骰按钮，超预算不能锁定', () => {
  start(/^方法 X：/, []);increase('STR',15);
  expect(screen.queryByRole('button', {name:'投掷传奇力量（d100）'})).toBeNull();
  fireEvent.change(screen.getByLabelText('购买传奇力量（每 10% 花 1 点）'), {target:{value:'100'}});
  expect(screen.getByText(/已花费 43 \/ 75/)).toBeTruthy();
  for(const ab of ['DEX','CON','INT','WIS','CHA'])increase(ab,15);
  expect(screen.getByText('购点超出预算。')).toBeTruthy();
  expect(screen.queryByRole('button', {name:'确认完成并锁定'})).toBeNull();
  expect(saved().events.every((e:any)=>e.dice.length===0)).toBe(true);
});

it('1E 自动传奇力量只投一次，恢复历史、切主题不会投新骰', () => {
  render(<StrictMode><App rng={sequenceRng([...Array(24).fill(6),88,...Array(24).fill(4)])} /></StrictMode>);
  fireEvent.click(screen.getByRole('button', {name:'AD&D 第一版'}));
  fireEvent.click(screen.getByRole('button', {name:/^方法 I：/}));
  fireEvent.click(screen.getByRole('button', {name:'开始生成'}));
  fireEvent.click(screen.getByRole('button', {name:'掷骰'}));
  fireEvent.click(within(screen.getByRole('group', {name:'候选结果'})).getAllByRole('button')[0]!);
  fireEvent.click(within(screen.getByRole('group', {name:'属性'})).getByRole('button', {name:/^STR/}));
  expect(saved().events.at(-1).dice).toEqual([88]);
  const first=localStorage.getItem('dndroll.session.v1');
  fireEvent.click(screen.getByRole('button', {name:'再掷一组'}));
  fireEvent.click(screen.getByRole('button', {name:/^第 1 组/}));
  fireEvent.click(screen.getByRole('button', {name:'浅色模式'}));
  expect(localStorage.getItem('dndroll.session.v1')).toBe(first);
});
