import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', m => console.log('CONSOLE', m.type(), m.text()));
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:3000/workspace', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Run scenario/i }).click();
await page.waitForTimeout(2500);
console.log('workspace body snippet', (await page.locator('body').innerText()).slice(0, 800));
await page.screenshot({ path: '/opt/cursor/artifacts/playwright_workspace.png', fullPage: true });

await page.goto('http://localhost:3000/federation', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Run 3-party slice/i }).click();
await page.waitForTimeout(4000);
const text = await page.locator('body').innerText();
console.log('federation body snippet', text.slice(0, 1200));
await page.screenshot({ path: '/opt/cursor/artifacts/playwright_federation.png', fullPage: true });
await browser.close();
