# backend

Trello風タスク管理アプリのバックエンド。

## 環境
- Java 25（LTS）
- Spring Boot 4.0.3
- Gradle（Wrapper同梱のため個別インストール不要）
- DB: PostgreSQL 17（Docker Composeで起動）

## 起動方法

### 1. PostgreSQLをDockerで起動する

リポジトリ直下（`backend`の一つ上）で以下を実行する。

```
docker compose up -d
```

### 2. Spring Bootを起動する

```
cd backend
JAVA_HOME=/opt/homebrew/opt/openjdk@25 ./gradlew bootRun
```

初回はGradle本体のダウンロードとビルドが走るため、起動まで数分かかる。
「Started BackendApplication」というログが表示されたら起動完了。

起動のたびに `src/main/resources/schema.sql` でテーブルを作成し（既に存在すればスキップ）、
`src/main/resources/data.sql` で中身をいったん空にしてからテストデータを再投入する。

停止するときはターミナルで `Ctrl + C`。

## 動作確認

サーバー起動後、別のターミナルで以下を実行する。

```
curl http://localhost:8080/api/health
curl http://localhost:8080/api/lists
curl http://localhost:8080/api/cards
```

- `/api/health` → `{"status":"ok"}`
- `/api/lists` → リスト（未着手／作業中／完了）の一覧
- `/api/cards` → カード（タスク）の一覧

が返れば正常に動作している。

## 補足
- `JAVA_HOME` を毎回指定しているのは、このマシンにJava 25がHomebrewの非標準の場所（keg-only）にインストールされているため。`/usr/libexec/java_home` にJava 25を登録すれば省略できるが、その場合は `sudo` 権限が必要になる。
- DB接続情報（ユーザー名・パスワード）は `src/main/resources/application.properties` に開発用の値を直書きしている。ローカルDocker環境限定の値のため今回はこのままとしている。
