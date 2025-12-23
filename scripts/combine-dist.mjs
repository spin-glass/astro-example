#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('📦 ビルド出力を統合中...');

const distDir = join(projectRoot, 'dist');

// Astroの出力は既にdistにある

// Slidevを追加
const slidesSource = join(projectRoot, 'slides', 'dist');
const slidesDest = join(distDir, 'slides');
if (existsSync(slidesSource)) {
  cpSync(slidesSource, slidesDest, { recursive: true });
  console.log('✅ Slidev出力をコピー: dist/slides/');
} else {
  console.warn('⚠️ Slidevビルド出力が見つかりません');
}

// Quartoを追加
const blogSource = join(projectRoot, 'blog', '_site');
const blogDest = join(distDir, 'blog');
if (existsSync(blogSource)) {
  cpSync(blogSource, blogDest, { recursive: true });
  console.log('✅ Quarto出力をコピー: dist/blog/');
} else {
  console.warn('⚠️ Quartoビルド出力が見つかりません');
}

console.log('🎉 統合完了！');

