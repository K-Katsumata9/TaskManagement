# frontend

Trello風タスク管理アプリのフロントエンド（ボード画面、一覧表示のみ）。

## 環境
- React + TypeScript
- Vite
- Tailwind CSS

## 起動方法

事前に `backend` と PostgreSQL（Docker）を起動しておく（[backend/README.md](../backend/README.md)参照）。

```
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## 動作確認

「未着手／作業中／完了」の3列が表示され、各列にバックエンドから取得したカードが表示されれば正常に動作している。

## 補足
- バックエンドのAPI（`http://localhost:8080`）は`src/api.ts`にハードコードしている
- CORS対応はバックエンド側（`backend/src/main/java/com/taskmanagement/backend/CorsConfig.java`）で行っている
- 今回のスコープはAPIから取得した一覧の表示のみ。カードの作成・編集・削除、ドラッグ&ドロップでの並び替えは未実装
