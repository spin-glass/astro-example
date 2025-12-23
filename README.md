# Portfolio - 山田太郎

エンジニア向けポートフォリオサイトのテンプレートです。
Astro + Slidev + Quartoを組み合わせて、職務経歴書・プレゼンテーション・技術ブログを一つのサイトで公開できます。

## デモ

🔗 [GitHub Pages で確認](https://YOUR_USERNAME.github.io/astro-example/)

## 構成

| パス | 技術 | 内容 |
|------|------|------|
| `/` | Astro 5 + Tailwind CSS | 職務経歴書（PDF出力対応） |
| `/slides/` | Slidev | 自己紹介プレゼンテーション |
| `/blog/` | Quarto | 技術ブログ |

## セットアップ

### 必要な環境

- Node.js 20+
- Quarto CLI
- (PDF生成用) Puppeteer

### インストール

```bash
# 依存関係のインストール
npm install

# Slidevの依存関係
cd slides && npm install && cd ..
```

## ローカル開発

### 職務経歴書（Astro）

```bash
npm run dev
# http://localhost:4321/
```

### スライド（Slidev）

```bash
cd slides
npm run dev
# http://localhost:3030/
```

### ブログ（Quarto）

```bash
cd blog
quarto preview
# http://localhost:4000/
```

## ビルド

### 全体ビルド（GitHub Pages用）

```bash
npm run build:all
```

`dist/` に以下の構成で出力されます：

```
dist/
├── index.html          # 職務経歴書
├── slides/             # プレゼンテーション
└── blog/               # 技術ブログ
```

### 個別ビルド

```bash
# 職務経歴書のみ
npm run build

# スライドのみ
cd slides && npm run build

# ブログのみ
cd blog && quarto render
```

## PDF出力

```bash
# 職務経歴書のPDF生成
npm run pdf
# output/resume.pdf に出力
```

## GitHub Pages への公開

1. リポジトリの Settings > Pages で Source を "GitHub Actions" に設定
2. コードをpushすると自動でビルド・デプロイされます

## カスタマイズ

### 職務経歴書

`src/pages/index.astro` 内のダミーデータを編集：

- `profile` - 基本情報
- `summary` - 職務要約
- `experiences` - 職務経歴
- `education` - 学歴
- `skills` - 技術スキル
- `certifications` - 資格・認定

### スライド

`slides/slides.md` を編集してプレゼンテーションを更新

### ブログ

`blog/posts/` に新しい記事を追加：

```bash
mkdir -p blog/posts/2024-03-01-new-article
touch blog/posts/2024-03-01-new-article/index.qmd
```

## 技術スタック

- [Astro 5](https://astro.build/) - 静的サイトジェネレーター
- [Tailwind CSS 4](https://tailwindcss.com/) - CSSフレームワーク
- [Slidev](https://sli.dev/) - Markdownプレゼンテーション
- [Quarto](https://quarto.org/) - 技術文書・ブログ
- [Puppeteer](https://pptr.dev/) - PDF生成

## ライセンス

MIT
