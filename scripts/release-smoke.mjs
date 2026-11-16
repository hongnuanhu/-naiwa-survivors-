import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('docs/screenshots', { recursive:true });
await mkdir('artifacts', { recursive:true });
const browser = await chromium.launch({ channel:'msedge', headless:true, args:['--enable-unsafe-swiftshader'] });
const results = [], errors = [], failures = [];
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport:mobile ? {width:844,height:390} : {width:1366,height:900}, isMobile:mobile, hasTouch:mobile });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if(r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
    const response = await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => { const b = document.querySelector('[data-action=start]'); return b && !b.disabled; });
    assert.equal(await page.evaluate(() => typeof window.__naiwa), 'undefined');
    if(!mobile) await page.screenshot({path:'docs/screenshots/lobby-desktop.png'});
    await page.locator('[data-action=start]').click();
    if(mobile) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:160,y:245,id:1}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:220,y:245,id:1}]});
      await page.waitForTimeout(600);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    } else {
      await page.keyboard.down('d'); await page.waitForTimeout(600); await page.keyboard.up('d');
    }
    await page.waitForTimeout(5000);
    assert.equal(await page.locator('[data-action=pause]').isVisible(), true);
    await page.screenshot({path:`docs/screenshots/battle-${mobile?'mobile':'desktop'}.png`});
    await page.locator('[data-action=pause]').click();
    assert.equal(await page.locator('[data-action=resume]').isVisible(), true);
    await page.locator('[data-action=resume]').click();
    results.push(`${mobile?'触屏视口':'桌面'}：生产页面加载、开始、移动输入、暂停和继续；测试入口不存在`);
    await context.close();
  }
  assert.deepEqual(errors, []); assert.deepEqual(failures, []);
} finally { await browser.close(); }
await writeFile('artifacts/release-smoke.json', JSON.stringify({results,errors,failures,note:'实际生产构建截图，无数值修改；Edge 桌面及触屏模拟，非微信真机。'},null,2));
console.log(JSON.stringify({results,errors,failures}, null, 2));
