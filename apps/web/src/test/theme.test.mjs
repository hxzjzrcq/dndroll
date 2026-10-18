import { readFileSync } from 'node:fs';
const css=readFileSync('src/styles.css','utf8');
import { describe, expect, it } from 'vitest';

const tokens=(block)=>Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]+)\s*;/gi)].map(m=>[m[1],m[2]]));
const dark=tokens(css.slice(css.indexOf(':root {'),css.indexOf('--font-display')));
const light={...dark,...tokens(css.slice(css.indexOf(':root[data-theme="light"]'),css.indexOf('@media (max-width: 520px)')))};
function rgb(hex){return hex.slice(1).match(hex.length===4?/./g:/../g).map(h=>parseInt(h.length===1?h+h:h,16)/255);}
function luminance(c){return c.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const [theme,palette] of Object.entries({dark,light})) describe(`V3-02: ${theme} semantic contrast`,()=>{
  it('normal text, muted text and states meet AA on surfaces and tinted states',()=>{
    for(const bg of ['bg','bg-deep','surface','surface-2']){
      for(const ink of ['ink','ink-dim','accent','danger','ok','warning']){
        expect(ratio(rgb(palette[ink]),rgb(palette[bg])),`${ink} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
      for(const [ink,alpha] of [['accent',.14],['danger',.16],['ok',.1],['warning',.08]]){
        const tint=rgb(palette[ink]),base=rgb(palette[bg]);
        expect(ratio(tint,tint.map((v,i)=>v*alpha+base[i]*(1-alpha))),`${ink} tint on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    for(const bg of ['accent','accent-hover']) expect(ratio(rgb(palette['on-accent']),rgb(palette[bg]))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(rgb(palette['on-danger']),rgb(palette['danger-fill']))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(rgb(palette.focus),rgb(palette.surface))).toBeGreaterThanOrEqual(3);
  });
});
it('theme state declarations use semantic variables, with no hardcoded color outside palettes',()=>{
  const rules=css.replace(/:root\s*\{[^}]*\}/g,'').replace(/:root\[data-theme="light"\]\s*\{[^}]*\}/g,'');
  expect(rules).not.toMatch(/oklch\(|#[\da-f]{3,8}\b/i);
});
