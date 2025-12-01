# Free Session PWA App

Next.js 14 (App Router) + TypeScript を使用した堅牢なPWAアプリケーション。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、OneSignalのApp IDを設定してください：

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
```

### 3. OneSignal Service Workerファイル

`public/OneSignalSDKWorker.js` と `public/OneSignalSDKUpdaterWorker.js` は既に配置済みです。
これらのファイルはOneSignalのCDNから最新のSDKを読み込みます。

### 4. アイコンの準備

`public` ディレクトリに以下のアイコンファイルを配置してください：

- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `favicon.ico`

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 6. ビルド

```bash
npm run build
npm start
```

## アプリの動作フロー

### Phase 1: ブラウザでのアクセス時
- iOS/Androidに応じたホーム画面への追加手順を表示

### Phase 2: PWA起動時 & 通知未許可
- 通知許可を促す画面を表示
- 「通知を許可する」ボタンをクリックすると通知許可をリクエスト

### Phase 3: PWA起動時 & 通知許可済み
- 「Free Session Start」ボタンを表示
- クリックすると外部サイトへ遷移

## デプロイ

Vercelへのデプロイ：

```bash
vercel
```

環境変数 `NEXT_PUBLIC_ONESIGNAL_APP_ID` をVercelのダッシュボードで設定してください。

## ライセンス

MIT
