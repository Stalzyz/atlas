const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:6001', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  await browser.close();
})();
