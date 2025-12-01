# デプロイ手順

## GitHubリポジトリの作成とプッシュ

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `kaz-pwa3`）
4. 「Public」または「Private」を選択
5. 「Initialize this repository with a README」は**チェックしない**（既にREADMEがあるため）
6. 「Create repository」をクリック

### 2. ローカルリポジトリをGitHubに接続

GitHubで作成したリポジトリのURLをコピーして、以下のコマンドを実行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/kaz-pwa3.git
git branch -M main
git push -u origin main
```

（`YOUR_USERNAME` をあなたのGitHubユーザー名に置き換えてください）

## Vercelでのデプロイ

### 方法1: Vercel Web UIを使用（推奨）

1. [Vercel](https://vercel.com) にログイン（GitHubアカウントでログイン推奨）
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出されるはず）
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
5. **Environment Variables** セクションで以下を追加：
   - `NEXT_PUBLIC_ONESIGNAL_APP_ID` = `your-onesignal-app-id`
6. 「Deploy」をクリック
7. デプロイ完了後、URLが表示されます（例: `https://kaz-pwa3.vercel.app`）

### 方法2: Vercel CLIを使用

```bash
# Vercel CLIをインストール（グローバル）
npm install -g vercel

# プロジェクトディレクトリで実行
vercel

# 初回はログインが必要
# プロンプトに従って設定
# 環境変数を設定するか聞かれたら、NEXT_PUBLIC_ONESIGNAL_APP_IDを設定
```

## 環境変数の設定

Vercelダッシュボードで環境変数を設定：

1. プロジェクトの「Settings」→「Environment Variables」
2. 以下を追加：
   - **Name**: `NEXT_PUBLIC_ONESIGNAL_APP_ID`
   - **Value**: OneSignalのApp ID
   - **Environment**: Production, Preview, Development すべてにチェック
3. 「Save」をクリック
4. 再デプロイが必要な場合は「Deployments」タブから再デプロイ

## デプロイ後の確認事項

- [ ] PWAマニフェストが正しく読み込まれているか
- [ ] OneSignalが正しく初期化されているか
- [ ] アイコンが表示されているか
- [ ] HTTPSでアクセスできるか（PWAには必須）

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードで「Settings」→「Domains」
2. ドメインを追加
3. DNS設定を更新

