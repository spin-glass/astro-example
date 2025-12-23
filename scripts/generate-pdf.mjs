#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 設定
const config = {
  port: 4321,
  outputDir: join(projectRoot, 'output'),
  outputFileName: 'resume.pdf',
  pageUrl: 'http://localhost:4321/',
  
  // PDF設定（A4サイズ）
  pdfOptions: {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '12mm',
      bottom: '15mm',
      left: '12mm',
    },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  },
};

/**
 * サーバーが起動するまで待機
 */
function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(check, 1000);
        } else {
          reject(new Error('サーバーの応答が正常ではありません'));
        }
      }).on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(check, 1000);
        } else {
          reject(new Error('サーバーへの接続がタイムアウトしました'));
        }
      });
    };
    
    check();
  });
}

/**
 * 開発サーバーを起動
 */
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 開発サーバーを起動中...');
    
    const server = spawn('npx', ['astro', 'dev'], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    server.stdout.on('data', (data) => {
      const output = data.toString();
      // デバッグ用（必要に応じてコメントアウト）
      // console.log('[stdout]', output);
    });

    server.stderr.on('data', (data) => {
      const output = data.toString();
      // デバッグ用（必要に応じてコメントアウト）
      // console.log('[stderr]', output);
    });

    server.on('error', (err) => {
      reject(new Error(`サーバー起動エラー: ${err.message}`));
    });

    // サーバープロセスが起動したら、HTTP接続を待機
    setTimeout(async () => {
      try {
        await waitForServer(config.pageUrl);
        console.log('✅ 開発サーバーが起動しました');
        resolve(server);
      } catch (err) {
        server.kill();
        reject(err);
      }
    }, 2000);
  });
}

/**
 * PDFを生成
 */
async function generatePDF() {
  console.log('📄 PDFを生成中...');
  
  // 出力ディレクトリを作成
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
    ],
  });

  try {
    const page = await browser.newPage();
    
    // ビューポートを設定（A4相当）
    await page.setViewport({
      width: 794,  // A4幅 (210mm @ 96dpi)
      height: 1123, // A4高さ (297mm @ 96dpi)
      deviceScaleFactor: 2, // 高解像度
    });

    // ページに移動
    console.log(`📍 ページを読み込み中: ${config.pageUrl}`);
    await page.goto(config.pageUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // フォントの読み込みを待機
    await page.evaluateHandle('document.fonts.ready');
    
    // 少し待機してレンダリング完了を確認
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PDFを生成
    const outputPath = join(config.outputDir, config.outputFileName);
    await page.pdf({
      path: outputPath,
      ...config.pdfOptions,
    });

    console.log(`✅ PDFが生成されました: ${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('='.repeat(50));
  console.log('📝 職務経歴書 PDF生成ツール');
  console.log('='.repeat(50));

  let server = null;
  
  try {
    // 開発サーバーを起動
    server = await startDevServer();
    
    // PDFを生成
    await generatePDF();
    
    console.log('='.repeat(50));
    console.log('🎉 PDF生成が完了しました！');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    // サーバーを停止
    if (server) {
      console.log('🛑 開発サーバーを停止中...');
      server.kill();
    }
  }
}

// 実行
main();
