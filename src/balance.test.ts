import {it,expect} from 'vitest';
import {newRun,tick,stats,chooseUpgrade,buy,combine,reroll,nextWave,purchaseInfo,type Run} from './core';
import {CHARACTERS,DIFFICULTIES} from './data';
import {mkdirSync,writeFileSync} from 'node:fs';

function play(r:Run){let steps=0,peak=0;while(!['dead','won'].includes(r.phase)&&steps<16000){
 if(r.phase==='upgrade'){const desired=['health','armor','damage','attackSpeed','regen','crit','harvest','speed'];let index=0,rank=99;r.choices.forEach((c,i)=>{const n=desired.indexOf(c.stat);if(n<rank){index=i;rank=n;}});chooseUpgrade(r,index);continue;}
 if(r.phase==='shop'){for(let attempt=0;attempt<6;attempt++){if(r.weapons.length===6)for(let i=0;i<r.weapons.length;i++)if(combine(r,i))break;let purchased=false;for(let i=0;i<r.offers.length;i++){const o=r.offers[i];if(!purchaseInfo(r,i).ok)continue;if(o.type==='weapon'||r.weapons.length>=4){buy(r,i);purchased=true;}}if(!purchased||r.coins<25||!reroll(r))break;}nextWave(r);continue;}
 // A simple circling player with local repulsion: no invulnerability or modified stats.
 const a=r.elapsed*.3;const target={x:480+Math.cos(a)*300,y:295+Math.sin(a)*145};let x=target.x-r.x,y=target.y-r.y;const length=Math.max(1,Math.hypot(x,y));x/=length;y/=length;
 for(const e of r.enemies){const dx=r.x-e.x,dy=r.y-e.y,d=Math.hypot(dx,dy);if(d>0&&d<100&&e.warm<=0){const force=(100-d)/35;x+=dx/d*force;y+=dy/d*force;}}
 tick(r,.05,{x,y});steps++;peak=Math.max(peak,r.enemies.length);expect(Number.isFinite(r.hp)&&Number.isFinite(r.coins)).toBe(true);
 }return {character:r.character,difficulty:r.difficulty.name,phase:r.phase,wave:r.wave,kills:r.kills,hp:Math.round(r.hp),weapons:r.weapons.map(w=>w.id+':'+w.tier).join(','),peak,seconds:Math.round(r.elapsed),coins:r.coins,maxHp:stats(r).maxHp};}
it('simulates full seeded runs for all characters without invalid states',()=>{
 const results=[];for(const c of CHARACTERS)for(const d of [DIFFICULTIES.easy,DIFFICULTIES.normal]){const r=newRun(c.id,d,43892);const result=play(r);results.push(result);expect(['dead','won']).toContain(result.phase);expect(result.peak).toBeLessThanOrEqual(105);}
 mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/balance-results.json',JSON.stringify(results,null,2));
},30000);
