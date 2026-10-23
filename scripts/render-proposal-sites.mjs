import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const port = 4387;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { stdio: 'ignore' });
let browser;
try {
  for (let i=0; i<50; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/scripts/proposal-samples/site.html`)).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH});
  const page = await browser.newPage({deviceScaleFactor:2});
  await mkdir('public/business/proposals',{recursive:true});
  for (const client of (process.env.PROPOSAL_VARIANT ? [process.env.PROPOSAL_VARIANT] : ['current','past'])) for (const topic of (client==='past'?['jobs','day','entry']:['mobile','contact','cases'])) for (const state of ['before','after']) {
    await page.setViewportSize(topic==='mobile'?{width:390,height:530}:{width:1000,height:620});
    await page.goto(`http://127.0.0.1:${port}/scripts/proposal-samples/${client==='past'?'recruitment':'site'}.html?client=${client}&topic=${topic}&state=${state}`);
    await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode()));});
    await page.screenshot({type:"jpeg",quality:88,path:`public/business/proposals/${client}-${topic}-${state}.jpg`});
  }
} finally { await browser?.close(); server.kill(); }
