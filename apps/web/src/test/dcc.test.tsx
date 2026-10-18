import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { sequenceRng } from '@dndroll/core';
import App from '../App';
const dice=[1,1,1,6,6,6,2,2,2,5,5,5,3,3,3,4,4,4];

it('V4-02 DCC single-session labels, history and complete result all use native abbreviations',()=>{
 render(<StrictMode><App rng={sequenceRng(dice)}/></StrictMode>);
 fireEvent.click(screen.getByRole('button',{name:'Dungeon Crawl Classics（DCC）'}));
 fireEvent.click(screen.getByRole('button',{name:/^3d6 顺序生成/}));
 fireEvent.click(screen.getByRole('button',{name:'开始生成'}));
 fireEvent.click(screen.getByRole('button',{name:'掷骰'}));
 expect([...document.querySelectorAll('.strip-cell .ability-abbr')].map(el=>el.textContent)).toEqual(['STR','AGI','STA','PER','INT','LCK']);
 expect(screen.getByRole('region',{name:'最近生成'}).textContent).toContain('STR 3 · AGI 18 · STA 6 · PER 15 · INT 9 · LCK 12');
 expect(screen.getByRole('region',{name:'数值'}).textContent).toContain('人格');
 const saved=localStorage.getItem('dndroll.session.v1');
 fireEvent.click(screen.getByRole('button',{name:'English'}));
 expect(document.querySelector('.score-strip')?.textContent).toContain('Personality');
 expect(document.querySelector('.score-strip')?.textContent).toContain('Luck');
 expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
 fireEvent.click(screen.getByRole('button',{name:'Finalize and lock'}));
 expect([...document.querySelectorAll('.final-cell .ability-abbr')].map(el=>el.textContent)).toEqual(['STR','AGI','STA','PER','INT','LCK']);
 expect(document.querySelector('.complete-panel')?.textContent).not.toMatch(/\b(?:DEX|CON|WIS|CHA)\b/);
});

it('V4-03 DCC result shows all six official modifiers and theme/language preserve rolls',()=>{
 render(<App rng={sequenceRng(dice)}/>);
 fireEvent.click(screen.getByRole('button',{name:'Dungeon Crawl Classics（DCC）'}));
 fireEvent.click(screen.getByRole('button',{name:/^3d6 顺序生成/}));
 fireEvent.click(screen.getByRole('button',{name:'开始生成'}));
 fireEvent.click(screen.getByRole('button',{name:'掷骰'}));
 expect([...document.querySelectorAll('.score-strip .ability-modifier')].map(el=>el.textContent)).toEqual(['(-3)','(+3)','(-1)','(+1)','(0)','(0)']);
 fireEvent.click(screen.getByRole('button',{name:'确认完成并锁定'}));
 const saved=localStorage.getItem('dndroll.session.v1');
 expect([...document.querySelectorAll('.final-grid .ability-modifier')].map(el=>el.textContent)).toEqual(['(-3)','(+3)','(-1)','(+1)','(0)','(0)']);
 fireEvent.click(screen.getByRole('button',{name:'English'}));
 fireEvent.click(screen.getByRole('button',{name:'Light mode'}));
 expect(screen.getByLabelText('Modifier +3')).toBeTruthy();
 expect(localStorage.getItem('dndroll.session.v1')).toBe(saved);
});
