/**
 * 前端行为测试：用固定骰序列驱动真实 UI。
 * 覆盖：普通分配、2E II 选低值、1E IV 整套选择、2E VI 分骰与上限、
 * PF1 28 骰池、三种购点成本、OSE 盗贼调整、存档恢复、语言切换。
 */
import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { sequenceRng, createSession, applyAction, serializeSession, type Session } from '@dndroll/core';
import App from '../App';

function renderApp(dice: number[]) {
  return render(<App rng={sequenceRng(dice)} />);
}

function pickMethod(versionZh: RegExp | string, methodZh: RegExp | string) {
  fireEvent.click(screen.getByRole('button', { name: versionZh }));
  fireEvent.click(screen.getByRole('button', { name: methodZh }));
  fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
}

const repeat = (vals: number[], times: number) => Array.from({ length: times }, () => vals).flat();

describe('普通分配流程（5E 2024 随机生成）', () => {
  it('掷骰 → 点选分配 → 完成锁定', () => {
    renderApp(repeat([1, 3, 4, 6], 6)); // 每组 4d6 去 1 → 全部 13
    pickMethod('D&D 5E（2024）', /随机生成/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));

    const candidates = within(screen.getByRole('group', { name: '候选结果' })).getAllByRole('button');
    expect(candidates).toHaveLength(6);
    const slots = screen.getByRole('group', { name: '属性' });
    for (const ab of ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']) {
      const pool = within(screen.getByRole('group', { name: '候选结果' }))
        .getAllByRole('button')
        .filter((b) => !b.className.includes('used'));
      fireEvent.click(pool[0]!);
      fireEvent.click(within(slots).getByRole('button', { name: new RegExp(`^${ab}`) }));
    }
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
    // 完成锁定后不允许继续分配
    expect(screen.queryByRole('group', { name: '候选结果' })).toBeNull();
  });
});

describe('AD&D 2E 方法 II：每项二选一，允许选较低结果', () => {
  it('为每项选择低值并完成', () => {
    renderApp(repeat([6, 6, 6, 1, 1, 1], 6)); // 每项 18 与 3
    pickMethod('AD&D 第二版', /^方法 II：/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    const lows = screen.getAllByRole('button', { name: /d6 1.*d6 1.*d6 1.*3/ });
    expect(lows).toHaveLength(6);
    for (const b of lows) fireEvent.click(b); // 选较低值合法
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
    const finals = document.querySelectorAll('.final-score');
    expect([...finals].every((el) => el.textContent === '3')).toBe(true);
  });
});

describe('AD&D 1E 方法 IV：十二套整套选择', () => {
  it('选择一整套后完成', () => {
    renderApp(Array(216).fill(4));
    pickMethod('AD&D 第一版', /^方法 IV：/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    const setCards = screen.getAllByRole('button', { name: /^第 \d+ 套/ });
    expect(setCards).toHaveLength(12);
    fireEvent.click(setCards[2]!); // 第 3 套
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
  });

  it('UA 方法 V 保持待核准且禁用', () => {
    renderApp([]);
    fireEvent.click(screen.getByRole('button', { name: 'AD&D 第一版' }));
    const ua = screen.getByRole('button', { name: /UA 方法 V/ });
    expect((ua as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getAllByText(/待核准/).length).toBeGreaterThan(0);
  });
});

describe('AD&D 2E 方法 VI：八点基础加七颗骰', () => {
  it('逐颗分配，超过 18 被拒绝且不破坏状态', () => {
    renderApp([6, 6, 5, 4, 3, 2, 1]);
    pickMethod('AD&D 第二版', /^方法 VI：/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));

    const cell = (ab: string) => screen.getByRole('button', { name: new RegExp(`^${ab}`) });
    const die = (v: number) => screen.getAllByRole('button', { name: `d6 ${v}` })[0]!;

    fireEvent.click(die(6));
    fireEvent.click(cell('STR')); // 8+6=14
    fireEvent.click(die(6));
    fireEvent.click(cell('STR')); // 14+6=20 → SCORE_CAP
    expect(screen.getByRole('alert').textContent).toContain('SCORE_CAP');
    expect(cell('STR').textContent).toContain('14'); // 状态未被破坏

    fireEvent.click(cell('DEX')); // 第二颗 6 改放 DEX
    fireEvent.click(die(5));
    fireEvent.click(cell('CON'));
    fireEvent.click(die(4));
    fireEvent.click(cell('INT'));
    fireEvent.click(die(3));
    fireEvent.click(cell('WIS'));
    fireEvent.click(die(2));
    fireEvent.click(cell('CHA'));
    // 最后一颗 1 放到 STR（15，合法）
    fireEvent.click(die(1));
    fireEvent.click(cell('STR'));
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
  });
});

describe('PF1 骰池 28：先分骰再掷', () => {
  it('配满 28 颗后才能掷骰并完成', () => {
    renderApp(Array(28).fill(4));
    fireEvent.click(screen.getByRole('button', { name: 'Pathfinder 第一版' }));
    fireEvent.click(screen.getByRole('button', { name: /^骰池/ }));
    fireEvent.click(screen.getByRole('radio', { name: '28' }));
    fireEvent.click(screen.getByRole('button', { name: '开始生成' }));

    // 未配满时不能确认配置
    expect((screen.getByRole('button', { name: '确认骰数配置' }) as HTMLButtonElement).disabled).toBe(true);
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: 'STR +1' }));
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: 'DEX +1' }));
    expect(screen.getByText('28 / 28')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '确认骰数配置' }));
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
    const finals = [...document.querySelectorAll('.final-score')].map((el) => el.textContent);
    expect(finals).toEqual(['12', '12', '12', '12', '12', '12']); // 每项取最高 3 颗 4
  });
});

describe('三种购点成本表', () => {
  it('3.5 购点：成本表计价、未用完须明确确认', () => {
    renderApp([]);
    pickMethod('D&D 3.5', /购点/);
    expect(screen.getByText('已花费 0 / 25 · 剩余', { exact: false })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'STR +1' })); // 8→9 成本 1
    expect(screen.getByText(/已花费 1 \/ 25/)).toBeTruthy();
    const fin = screen.getByRole('button', { name: '确认完成并锁定' }) as HTMLButtonElement;
    expect(fin.disabled).toBe(true); // 未确认保留剩余点数
    fireEvent.click(screen.getByLabelText('确认保留未用完的点数'));
    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
  });

  it('PF1 购点：负成本降值、超支禁止完成', () => {
    renderApp([]);
    pickMethod('Pathfinder 第一版', /购点/);
    expect(screen.getByText(/已花费 0 \/ 15/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'CHA -1' }));
    // CHA 10→9 成本 -1：已花费应为 -1
    expect(screen.getByText(/已花费 -1 \/ 15/)).toBeTruthy();
    // 全部拉到 18：17×6 = 102，远超 15
    for (const ab of ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']) {
      const up = screen.getByRole('button', { name: `${ab} +1` });
      for (let i = 0; i < 9; i++) fireEvent.click(up);
    }
    expect(screen.getByText('购点超出预算。')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '确认完成并锁定' })).toBeNull();
  });

  it('5E 2024 购点：上限 15', () => {
    renderApp([]);
    pickMethod('D&D 5E（2024）', /27 点购点/);
    const up = screen.getByRole('button', { name: 'STR +1' }) as HTMLButtonElement;
    for (let i = 0; i < 10; i++) fireEvent.click(up);
    expect(up.disabled).toBe(true); // 15 封顶
    expect(screen.getByText(/已花费 9 \/ 27/)).toBeTruthy(); // 8→15 成本 9
  });
});

describe('OSE 盗贼主属性调整', () => {
  it('选择盗贼后 INT→DEX 交换，盗贼供出不含 STR', () => {
    renderApp([3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4]);
    // OSE 顺序 STR,INT,WIS,DEX,CON,CHA → 9,12,12,15,12,12
    pickMethod('OSE — 经典奇幻', /三骰依序/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    fireEvent.click(screen.getByRole('radio', { name: /盗贼/ }));

    const donor = screen.getByLabelText(/供出/) as HTMLSelectElement;
    expect([...donor.options].map((o) => o.value).sort()).toEqual(['', 'INT', 'WIS'].sort()); // 不含 STR
    fireEvent.change(donor, { target: { value: 'INT' } });
    fireEvent.change(screen.getByLabelText(/目标/), { target: { value: 'DEX' } });
    fireEvent.click(screen.getByRole('button', { name: '执行交换' }));
    expect(screen.getByText('INT −2 → DEX +1')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '确认完成并锁定' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
    const cells = [...document.querySelectorAll('.final-cell')];
    const dex = cells.find((c) => c.textContent?.includes('DEX'))!;
    expect(dex.textContent).toContain('16'); // 15+1
    expect(dex.textContent).toContain('15'); // 显示基础值
  });
});

describe('存档与恢复', () => {
  it('自动保存的会话在下次打开时恢复，且不重复掷骰', () => {
    const dice = repeat([1, 3, 4, 6], 6);
    const first = renderApp(dice);
    pickMethod('D&D 5E（2024）', /随机生成/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    expect(screen.getAllByRole('button', { name: /d6 6/ }).length).toBeGreaterThan(0);
    first.unmount();

    render(<App rng={sequenceRng([])} />); // 没有可用骰子：若重掷会报错
    expect(screen.getByText('检测到上次未完成的会话，已自动恢复。')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /d6 6/ }).length).toBeGreaterThan(0);
  });

  it('损坏的存档显示错误而不是静默清空', () => {
    localStorage.setItem('dndroll.session.v1', '{"schemaVersion":2,"rulesVersion":"x"}');
    const first = render(<StrictMode><App rng={sequenceRng([])} /></StrictMode>);
    const raw = localStorage.getItem('dndroll.session.v1');
    expect(raw).toBe('{"schemaVersion":2,"rulesVersion":"x"}');
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(localStorage.getItem('dndroll.session.v1')).toBe(raw);
    first.unmount();
    renderApp([]);
    fireEvent.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByRole('alert').textContent).toContain('无法读取');
    fireEvent.click(screen.getByRole('button', { name: '清除本地存档' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(localStorage.getItem('dndroll.session.v1')).toBeNull();
    pickMethod('D&D 5E（2024）', /随机生成/);
    expect(localStorage.getItem('dndroll.session.v1')).not.toBeNull();
  });

  it('导入合法存档 JSON 恢复已完成会话', () => {
    let s: Session = createSession({ versionId: 'dnd5e2024', methodId: 'dnd5e2024.array', options: {} });
    s = applyAction(s, { type: 'assign', assignments: { STR: 'a1.r1', DEX: 'a1.r2', CON: 'a1.r3', INT: 'a1.r4', WIS: 'a1.r5', CHA: 'a1.r6' } });
    s = applyAction(s, { type: 'finalize' });
    const json = serializeSession(s);

    renderApp([]);
    fireEvent.click(screen.getByRole('button', { name: '导入存档' }));
    fireEvent.change(screen.getByPlaceholderText('{"schemaVersion":1,…}'), { target: { value: json } });
    fireEvent.click(screen.getByRole('button', { name: '校验并恢复' }));
    expect(screen.getByText('属性生成结果')).toBeTruthy();
  });

  it('导入非法存档显示错误且保留当前会话', () => {
    renderApp([]);
    fireEvent.click(screen.getByRole('button', { name: '导入存档' }));
    fireEvent.change(screen.getByPlaceholderText('{"schemaVersion":1,…}'), { target: { value: '{"bad":1}' } });
    fireEvent.click(screen.getByRole('button', { name: '校验并恢复' }));
    expect(screen.getByRole('alert').textContent).toContain('存档无法恢复');
  });
});

describe('语言切换', () => {
  it('切换中英文不重掷、不改变结果', () => {
    renderApp(repeat([1, 3, 4, 6], 6));
    pickMethod('D&D 5E（2024）', /随机生成/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    const saveBefore = localStorage.getItem('dndroll.session.v1');
    const totalsBefore = [...document.querySelectorAll('.candidate-total .mono')].map((el) => el.textContent).join(',');

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByText('DNDROLL Ability Generator')).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Candidate results' })).toBeTruthy();
    // 存档与骰值不变：切语言不重掷、不重置
    expect(localStorage.getItem('dndroll.session.v1')).toBe(saveBefore);
    expect([...document.querySelectorAll('.candidate-total .mono')].map((el) => el.textContent).join(',')).toBe(totalsBefore);

    fireEvent.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByRole('group', { name: '候选结果' })).toBeTruthy();
    expect(localStorage.getItem('dndroll.session.v1')).toBe(saveBefore);
  });
});


describe('维护回归：存档保护与浏览', () => {
  it('有损坏存档时新建与操作不覆盖原始字节，明确清除后保存当前会话', () => {
    const raw = '{broken';
    localStorage.setItem('dndroll.session.v1', raw);
    renderApp([]);
    pickMethod('D&D 3.5', /购点/);
    fireEvent.click(screen.getByRole('button', { name: 'STR +1' }));
    expect(localStorage.getItem('dndroll.session.v1')).toBe(raw);
    fireEvent.click(screen.getByRole('button', { name: '清除本地存档' }));
    const saved = localStorage.getItem('dndroll.session.v1')!;
    expect(JSON.parse(saved).request.methodId).toBe('dnd35.dmg-point-buy');
  });

  it('浏览版本与方法不改存档；取消替换保留进度，确认才建立新会话', () => {
    renderApp(repeat([1, 3, 4, 6], 6));
    pickMethod('D&D 5E（2024）', /随机生成/);
    fireEvent.click(screen.getByRole('button', { name: '掷骰' }));
    const saved = localStorage.getItem('dndroll.session.v1');
    fireEvent.click(screen.getByRole('button', { name: 'D&D 3.5' }));
    expect(screen.getByText(/正在浏览其他版本或方法/)).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('group', { name: '候选结果' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /购点/ }));
    expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
    fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
    fireEvent.click(screen.getByRole('button', { name: '返回当前会话' }));
    expect(screen.queryByText(/正在浏览其他版本或方法/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'D&D 3.5' }));
    fireEvent.click(screen.getByRole('button', { name: /购点/ }));
    fireEvent.click(screen.getByRole('button', { name: '开始生成' }));
    fireEvent.click(screen.getByRole('button', { name: '放弃并继续' }));
    expect(screen.queryByRole('group', { name: '候选结果' })).toBeNull();
    expect(screen.queryByText(/正在浏览其他版本或方法/)).toBeNull();
    expect(localStorage.getItem('dndroll.session.v1')).not.toBe(saved);
    expect(screen.getByText(/已花费 0 \/ 25/)).toBeTruthy();
  });

  it('浏览时操作旧会话不强制跳回导航', () => {
    renderApp([]);
    pickMethod('D&D 3.5', /购点/);
    fireEvent.click(screen.getByRole('button', { name: 'AD&D 第一版' }));
    fireEvent.click(screen.getByRole('button', { name: 'STR +1' }));
    expect(screen.getByText(/正在浏览其他版本或方法/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /UA 方法 V/ })).toBeTruthy();
    expect(screen.getByText(/已花费 1 \/ 25/)).toBeTruthy();
  });
});
