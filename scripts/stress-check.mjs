import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
try{
const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:1});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.querySelector('[data-action=start]').disabled);await page.locator('[data-action=start]').click();
const measurements=[];
for(let cycle=0;cycle<3;cycle++){
 await page.evaluate(async(cycle)=>{const core=await import('/src/core.ts');const q=window.__naiwa,r=core.newRun(['naiwa','meituan','naidan'][cycle]);r.wave=12;r.remaining=75;r.invulnerable=999;r.weapons=['milk','fist','lid','horn','peach','turret'].map(id=>({id,tier:3,cooldown:.1}));r.hp=core.stats(r).maxHp;
 for(let i=0;i<104;i++){const a=i*2.4,rad=110+i%8*30;core.spawnEnemy(r,['chaser','shooter','bomber','shield','hammer'][i%5],Math.max(45,Math.min(915,480+Math.cos(a)*rad)),Math.max(90,Math.min(500,300+Math.sin(a)*rad*.6)));}core.spawnEnemy(r,'boss',480,120);q.host.run=r;q.host.paused=false;q.renderPhase();window.__frameTimes=[];let prev=performance.now();window.__measure=true;function frame(now){window.__frameTimes.push(now-prev);prev=now;if(window.__measure)requestAnimationFrame(frame);}requestAnimationFrame(frame);},cycle);
 await page.waitForTimeout(5000);
 measurements.push(await page.evaluate(()=>{window.__measure=false;const f=window.__frameTimes.slice(10).sort((a,b)=>a-b);const s=window.__naiwa.game.scene.getScene('arena');return{character:window.__naiwa.host.run.character,frames:f.length,medianFrameMs:Math.round(f[Math.floor(f.length*.5)]*10)/10,p95FrameMs:Math.round(f[Math.floor(f.length*.95)]*10)/10,displayObjects:s.children.length,enemies:window.__naiwa.host.run.enemies.length,shots:window.__naiwa.host.run.shots.length,heapBytes:performance.memory?.usedJSHeapSize};}));
 await page.locator('[data-action=pause]').click();
 if(cycle===0){await page.locator('[data-action=resume]').click();await page.screenshot({path:'artifacts/battle-crowded.png'});await page.locator('[data-action=pause]').click();}
}
assert.deepEqual(errors,[]);await writeFile('artifacts/stress-results.json',JSON.stringify({measurements,errors,limit:'Headless desktop Edge mobile viewport, not real device performance certification. Three short dense scenes, not three complete human sessions.'},null,2));console.log(JSON.stringify(measurements));
}finally{await browser.close();}
