const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const baseUrl = 'http://127.0.0.1:4173';
const executablePath = '/home/axgu/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const evidenceDir = '/home/axgu/code/rcv_website1/.sisyphus/evidence';

async function collectHomeState(page, label) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('[data-testid="home-intro"]').scrollIntoViewIfNeeded();

  const result = {
    label,
    introVisible: await page.locator('[data-testid="home-intro"]').isVisible(),
    paragraph1Visible: await page.locator('[data-testid="home-intro-paragraph-1"]').isVisible(),
    paragraph2Visible: await page.locator('[data-testid="home-intro-paragraph-2"]').isVisible(),
    footerVisible: await page.locator('[data-testid="site-footer"]').isVisible(),
    hasQuickLinks: (await page.locator('text=Quick Links').count()) > 0 || (await page.locator('text=快速链接').count()) > 0,
    hasResearchAreas: (await page.locator('text=Research Areas').count()) > 0 || (await page.locator('text=研究领域').count()) > 0,
    overflowFree: await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  };

  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const report = [];

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  report.push(await collectHomeState(desktop, 'home-desktop-en'));
  await desktop.screenshot({ path: path.join(evidenceDir, 'task-3-home-desktop-en.png'), fullPage: true });

  await desktop.getByRole('button', { name: '中文' }).click();
  await desktop.locator('[data-testid="home-intro"]').scrollIntoViewIfNeeded();
  report.push({
    label: 'home-desktop-zh',
    introVisible: await desktop.locator('[data-testid="home-intro"]').isVisible(),
    paragraph1Visible: await desktop.locator('[data-testid="home-intro-paragraph-1"]').isVisible(),
    paragraph2Visible: await desktop.locator('[data-testid="home-intro-paragraph-2"]').isVisible(),
    footerVisible: await desktop.locator('[data-testid="site-footer"]').isVisible(),
    hasQuickLinks: (await desktop.locator('text=Quick Links').count()) > 0 || (await desktop.locator('text=快速链接').count()) > 0,
    hasResearchAreas: (await desktop.locator('text=Research Areas').count()) > 0 || (await desktop.locator('text=研究领域').count()) > 0,
    overflowFree: await desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  });
  await desktop.screenshot({ path: path.join(evidenceDir, 'task-3-home-desktop-zh.png'), fullPage: true });

  await desktop.getByRole('button', { name: '联系' }).click();
  await desktop.waitForLoadState('networkidle');
  await desktop.locator('[data-testid="site-footer"]').scrollIntoViewIfNeeded();
  report.push({
    label: 'contact-desktop-zh',
    footerVisible: await desktop.locator('[data-testid="site-footer"]').isVisible(),
    hasQuickLinks: (await desktop.locator('text=Quick Links').count()) > 0 || (await desktop.locator('text=快速链接').count()) > 0,
    hasResearchAreas: (await desktop.locator('text=Research Areas').count()) > 0 || (await desktop.locator('text=研究领域').count()) > 0,
    overflowFree: await desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  });
  await desktop.screenshot({ path: path.join(evidenceDir, 'task-3-contact-footer.png'), fullPage: true });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobile.getByRole('button', { name: /menu|x/i }).click();
  await mobile.getByRole('button', { name: '中文' }).click();
  await mobile.locator('[data-testid="home-intro"]').scrollIntoViewIfNeeded();
  report.push({
    label: 'home-mobile-zh',
    introVisible: await mobile.locator('[data-testid="home-intro"]').isVisible(),
    paragraph1Visible: await mobile.locator('[data-testid="home-intro-paragraph-1"]').isVisible(),
    paragraph2Visible: await mobile.locator('[data-testid="home-intro-paragraph-2"]').isVisible(),
    footerVisible: await mobile.locator('[data-testid="site-footer"]').isVisible(),
    hasQuickLinks: (await mobile.locator('text=Quick Links').count()) > 0 || (await mobile.locator('text=快速链接').count()) > 0,
    hasResearchAreas: (await mobile.locator('text=Research Areas').count()) > 0 || (await mobile.locator('text=研究领域').count()) > 0,
    overflowFree: await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  });
  await mobile.screenshot({ path: path.join(evidenceDir, 'task-3-home-mobile-zh.png'), fullPage: true });
  await mobile.close();

  await browser.close();
  fs.writeFileSync(path.join(evidenceDir, 'task-3-home-smoke.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
