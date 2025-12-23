#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const config = {
  baseUrl: 'http://localhost:4000',
  outputDir: join(projectRoot, 'output'),
};

async function takeScreenshots() {
  console.log('📸 ブログのスクリーンショットを撮影中...');
  
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
      height: 800,
      deviceScaleFactor: 2,
    });

    // ホームページ
    await page.goto(`${config.baseUrl}/`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({
      path: join(config.outputDir, 'blog-home.png'),
      fullPage: true,
    });
    console.log('✅ ホームページ保存');

    // ブログ一覧
    await page.goto(`${config.baseUrl}/posts.html`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({
      path: join(config.outputDir, 'blog-posts.png'),
      fullPage: true,
    });
    console.log('✅ ブログ一覧保存');

    console.log(`✅ すべてのスクリーンショット保存完了: ${config.outputDir}`);
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(err => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});

