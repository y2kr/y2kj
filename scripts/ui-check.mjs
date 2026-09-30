import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const port = 4175;
const url = `http://127.0.0.1:${port}/y2kj/`;
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)], {
  stdio: 'ignore',
});

try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const browser = await chromium.launch({ headless: true });
  for (const [width, deviceScaleFactor] of [[1280, 1], [1280, 1.25], [1280, 2], [390, 2], [320, 2]]) {
    const probe = await browser.newPage({
      viewport: { width, height: 900 }, deviceScaleFactor,
    });
    await probe.goto(url);
    await probe.waitForSelector('#geo-container canvas');
    const dimensions = await probe.evaluate(() => {
      const container = document.querySelector('#geo-container');
      const canvas = container.querySelector('canvas').getBoundingClientRect();
      return { width: canvas.width, height: canvas.height,
        expectedWidth: container.clientWidth, expectedHeight: container.clientHeight };
    });
    assert.equal(dimensions.width, dimensions.expectedWidth, `canvas overflows at DPR ${deviceScaleFactor}`);
    assert.equal(dimensions.height, dimensions.expectedHeight, `canvas overflows at DPR ${deviceScaleFactor}`);
    await probe.close();
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.waitForSelector('#geo-container canvas');

  const layout = await page.evaluate(() => {
    const logo = document.querySelector('header img').getBoundingClientRect();
    const shape = document.querySelector('#geo-container').getBoundingClientRect();
    return {
      logoTop: logo.top,
      shapeCenterDelta: shape.left + shape.width / 2 - innerWidth / 2,
    };
  });

  const canvas = page.locator('#geo-container canvas');
  const before = await canvas.screenshot();
  await page.waitForTimeout(300);
  const after = await canvas.screenshot();
  const pixels = PNG.sync.read(after).data;
  const ratios = [];
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] > 40 && pixels[i + 2] > 40 && pixels[i + 2] > pixels[i + 1] * 1.5) {
      ratios.push(pixels[i] / pixels[i + 2]);
    }
  }
  assert(ratios.length > 100, 'wireframe is missing');
  const colorSpread = Math.max(...ratios) - Math.min(...ratios);
  assert(colorSpread > 0.15, `wireframe gradient is missing (color spread ${colorSpread.toFixed(3)})`);

  assert(layout.logoTop >= 32, `logo top spacing was ${layout.logoTop}px`);
  assert(Math.abs(layout.shapeCenterDelta) <= 1, `shape was offset ${layout.shapeCenterDelta}px`);
  assert(!before.equals(after), 'shape did not animate');

  const canvasBox = await canvas.boundingBox();
  assert(canvasBox);
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.8, canvasBox.y + canvasBox.height * 0.8);
  await page.mouse.up();
  await page.setViewportSize({ width: 1270, height: 900 });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
  await page.mouse.wheel(0, -10000);
  await page.waitForTimeout(300);

  const zoomed = PNG.sync.read(await canvas.screenshot());
  let minX = zoomed.width;
  let minY = zoomed.height;
  let maxX = 0;
  let maxY = 0;
  for (let index = 0; index < zoomed.data.length; index += 4) {
    const red = zoomed.data[index];
    const green = zoomed.data[index + 1];
    const blue = zoomed.data[index + 2];
    if (red < 10 || blue < 20 || blue < green * 1.5) continue;
    const pixel = index / 4;
    const x = pixel % zoomed.width;
    const y = Math.floor(pixel / zoomed.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const edgeGap = Math.min(minX, minY, zoomed.width - maxX, zoomed.height - maxY);
  const shapeCenterDelta = Math.hypot(
    (minX + maxX) / 2 - zoomed.width / 2,
    (minY + maxY) / 2 - zoomed.height / 2
  );
  assert(edgeGap > 20, `shape was too zoomed in (${edgeGap}px gap)`);
  assert(shapeCenterDelta < 15, `shape was off-center by ${shapeCenterDelta.toFixed(1)}px`);
  assert.deepEqual(errors, [], `browser errors: ${errors.join('; ')}`);

  const reducedPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await reducedPage.goto(url);
  const reducedCanvas = reducedPage.locator('#geo-container canvas');
  await reducedCanvas.waitFor();
  const reducedBefore = await reducedCanvas.screenshot();
  await reducedPage.waitForTimeout(500);
  const reducedAfter = await reducedCanvas.screenshot();
  assert(!reducedBefore.equals(reducedAfter), 'shape stopped under reduced-motion mode');
  await reducedPage.close();

  const privatePage = await browser.newPage();
  await privatePage.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith('webgl') ? null : getContext.call(this, type, ...args);
    };
  });
  await privatePage.goto(url);
  await privatePage.locator('#geo-container svg').waitFor({ timeout: 5000 });
  assert(await privatePage.locator('#geo-container svg path').count() > 0, 'shape is blank without WebGL');
  const svg = privatePage.locator('#geo-container svg');
  const svgBefore = await svg.screenshot();
  await privatePage.waitForTimeout(200);
  assert(!svgBefore.equals(await svg.screenshot()), 'SVG fallback is frozen');
  await privatePage.close();

  await page.goto(`${url}projects/`);
  const headingFont = await page.locator('h1').evaluate((heading) => getComputedStyle(heading).fontFamily);
  assert(headingFont.includes('Courier New'), `unexpected heading font: ${headingFont}`);
  assert.equal(await page.getByText('Selected work', { exact: true }).count(), 0);
  assert(await page.locator('.project-list article').evaluateAll((articles) =>
    articles.every((article) => article.querySelectorAll(':scope > p').length === 1
      && article.querySelectorAll(':scope > a').length === 0)
  ), 'project listing should only show the linked title and summary');

  await page.goto(`${url}projects/cbir/`);
  assert.equal(await page.locator('.eyebrow, .lede').count(), 0);
  const projectLayout = await page.evaluate(() => {
    const heading = getComputedStyle(document.querySelector('h1'));
    return {
      font: heading.fontFamily,
      size: parseFloat(heading.fontSize),
      columns: getComputedStyle(document.querySelector('.gallery')).gridTemplateColumns.split(' ').length,
    };
  });
  assert.equal(projectLayout.font, headingFont);
  assert(projectLayout.size <= 33);
  assert.equal(projectLayout.columns, 4);
  await page.locator('[data-gallery-image]').first().click();
  assert(await page.locator('dialog').evaluate((dialog) => dialog.open));
  await page.locator('dialog img').evaluate((image) => image.decode());
  const imageLayout = await page.locator('dialog img').evaluate((image) => {
    const bounds = image.getBoundingClientRect();
    return {
      fits: bounds.width <= innerWidth * 0.9 + 1 && bounds.height <= innerHeight * 0.9 + 1,
      natural: bounds.width <= image.naturalWidth + 6 && bounds.height <= image.naturalHeight + 6,
      border: getComputedStyle(image).borderTopWidth,
    };
  });
  assert(imageLayout.fits, 'expanded image needs space around it');
  assert(imageLayout.natural, 'expanded image should not be upscaled');
  assert.equal(imageLayout.border, '3px');
  assert((await page.locator('body').evaluate((body) => getComputedStyle(body).cursor)).includes('mec300.cur'));
  await page.mouse.click(5, 5);
  assert.equal(await page.locator('dialog').evaluate((dialog) => dialog.open), false);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'project page overflows');
  }

  console.log('UI check passed:', { ...layout, headingFont });
  await browser.close();
} finally {
  server.kill();
}
