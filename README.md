# TaskManagement

Trello風タスク管理アプリ（学習用プロジェクト）。
リスト（列）とカードでタスクを管理できる、シンプルなボード画面のWebアプリ。

詳しい要件は [docs/requirements.md](docs/requirements.md) を参照。

## 技術構成

| 項目 | 使用技術 |
|---|---|
| フロントエンド | React（TypeScript）+ Vite + Tailwind CSS |
| バックエンド | Java（Spring Boot）+ Gradle |
| データベース | PostgreSQL（Docker） |

バージョンの詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## ディレクトリ構成

```
.
├── backend/          Spring Bootバックエンド（API）
├── frontend/          Reactフロントエンド（ボード画面）
├── docker-compose.yml PostgreSQLの起動設定
├── docs/              要件定義・画面設計・DB設計などのドキュメント
└── prototype/         初期段階のHTML/CSS/JSによる画面プロトタイプ
```

## セットアップ・起動方法

### 1. PostgreSQLを起動する

```
docker compose up -d
```

### 2. バックエンドを起動する

```
cd backend
JAVA_HOME=/opt/homebrew/opt/openjdk@25 ./gradlew bootRun
```

詳細は [backend/README.md](backend/README.md) を参照。

### 3. フロントエンドを起動する

```
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。詳細は [frontend/README.md](frontend/README.md) を参照。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [docs/requirements.md](docs/requirements.md) | 要件定義書（全体概要・非機能要件など） |
| [docs/functional-requirements.md](docs/functional-requirements.md) | 機能要件・対象外機能・受け入れ基準 |
| [docs/screen-design.md](docs/screen-design.md) | 画面設計（ボード画面のレイアウト） |
| [docs/database-design.md](docs/database-design.md) | データベース設計（テーブル定義） |
| [docs/tech-stack.md](docs/tech-stack.md) | 技術スタックと採用バージョン |

## 開発ルール

このリポジトリでの開発ルール（Issue駆動・ブランチ運用・PR必須化）は [CLAUDE.md](CLAUDE.md) を参照。

## 現在の実装状況

- [x] リスト・カードの一覧取得API（`GET /api/lists`, `GET /api/cards`）
- [x] ボード画面での一覧表示（フロントエンド）
- [x] リスト・カードの新規作成API（`POST /api/lists`, `POST /api/cards`）とフロントエンドのフォーム
- [x] カード・リストの編集（`PUT /api/lists/{id}`, `PUT /api/cards/{id}`）とモーダルUI
- [x] カードへの詳細・期限フィールド追加
- [ ] カード・リストの削除
- [ ] ドラッグ&ドロップでの並び替え、優先順位／期限でのソートボタン
