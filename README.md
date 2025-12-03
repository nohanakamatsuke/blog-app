# Personal Blog

Next.js + Notion API で構築した個人ブログサイトです。

## 🌐 デモ

[https://nohana-hp.vercel.app/](https://nohana-i9b9lchpu-nohanakamatsukes-projects.vercel.app/)

## 🛠️ 使用技術

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Notion API
- **Deployment**: Vercel
- **Other**: notion-to-md, react-markdown

## ✨ 特徴

- Notion をCMSとして使用し、記事管理が簡単
- マークダウン形式でブログ記事を表示
- レスポンシブデザイン対応

## 📁 プロジェクト構成
```
blog-app/
├── app/
│   ├── _components/     # 再利用可能なコンポーネント
│   ├── about/          # Aboutページ
│   └── page.tsx        # トップページ
├── lib/
│   ├── api.ts          # ブログ記事取得のロジック
│   └── notion.ts       # Notion API連携
└── public/             # 静的ファイル
```

## 🚀 ローカル開発

### 1. リポジトリをクローン
```bash
git clone https://github.com/nohanakamatsuke/blog-app.git
cd blog-app
```

### 2. 依存関係をインストール
```bash
npm install
```

### 3. 環境変数を設定

`.env.local` ファイルを作成し、以下を追加：
```
NOTION_TOKEN=your_notion_integration_token
DATABASE_ID=your_notion_database_id
```

### 4. 開発サーバーを起動
```bash
npm run dev
```

http://localhost:3000 でアクセス

## 📝 Notion の設定

1. [Notion Integrations](https://www.notion.so/my-integrations) でインテグレーションを作成
2. データベースをインテグレーションに共有
3. トークンとデータベースIDを `.env.local` に設定

## 🎨 カスタマイズ

- デザイン: `app/globals.css` と Tailwind CSS
- コンテンツ: Notion データベースで記事を管理
- About ページ: `app/about/page.tsx` で編集

## 📄 ライセンス

MIT

## 👤 作成者

Nohana Kamatsuke
- Website: https://nohana-hp.vercel.app/
- GitHub: [@nohanakamatsuke](https://github.com/nohanakamatsuke)
