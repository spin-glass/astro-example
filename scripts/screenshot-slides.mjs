#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const config = {
  pageUrl: 'http://localhost:3030/',
  outputDir: join(projectRoot, 'output'),
};

async function takeScreenshots() {
  console.log('📸 スライドのスクリーンショットを撮影中...');
  
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
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    });

    // スライド1を撮影
    await page.goto(`${config.pageUrl}1`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: join(config.outputDir, 'slide-1.png'),
    });
    console.log('✅ スライド1保存');

    // スライド2を撮影
    await page.goto(`${config.pageUrl}2`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.screenshot({
      path: join(config.outputDir, 'slide-2.png'),
    });
    console.log('✅ スライド2保存');

    // スライド3を撮影
    await page.goto(`${config.pageUrl}4`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.screenshot({
      path: join(config.outputDir, 'slide-4.png'),
    });
    console.log('✅ スライド4保存');

    console.log(`✅ すべてのスクリーンショット保存完了: ${config.outputDir}`);
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(err => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});

