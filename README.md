# Free Session PWA App

Next.js (App Router) を使用したPWAアプリケーション。ユーザーをLINEやSNSから誘導し、ホーム画面への追加とプッシュ通知の許可を促すことで、Free Sessionへのアクセスを提供します。

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: @ducanh2912/next-pwa
- **Notifications**: react-onesignal
- **Deployment**: Vercel

## セットアップ

### 1. 依存関係のインストール

以下のコマンドで必要なパッケージをインストールします：

```bash
npm install
```

または、yarnを使用する場合：

```bash
yarn install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、OneSignalのApp IDを設定してください：

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 4. ビルド

```bash
npm run build
npm start
```

## アプリの動作フロー

### Phase 1: ブラウザでのアクセス時（未インストール状態）
- ユーザーがブラウザでアクセス
- iOS/Androidに応じたホーム画面への追加手順を表示

### Phase 2: PWA起動時 & 通知未許可
- ホーム画面からアプリを起動
- 通知許可を促す画面を表示

### Phase 3: PWA起動時 & 通知許可済み
- 通知が許可されている状態
- Free Sessionボタンを表示

## アイコンの準備

`public` ディレクトリに以下のアイコンファイルを配置してください：

- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `favicon.ico`

## デプロイ

Vercelへのデプロイ：

```bash
vercel
```

環境変数 `NEXT_PUBLIC_ONESIGNAL_APP_ID` をVercelのダッシュボードで設定してください。

## ライセンス

MIT

