#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const config = {
  pageUrl: 'http://localhost:4321/',
  outputDir: join(projectRoot, 'output'),
};

async function takeScreenshot() {
  console.log('📸 スクリーンショットを撮影中...');
  
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.goto(config.pageUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const outputPath = join(config.outputDir, 'screenshot.png');
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    console.log(`✅ スクリーンショット保存: ${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

takeScreenshot().catch(err => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});

