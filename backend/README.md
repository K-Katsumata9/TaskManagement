# backend

Trello風タスク管理アプリのバックエンド（Spring Boot雛形）。

## 環境
- Java 25（LTS）
- Spring Boot 4.0.3
- Gradle（Wrapper同梱のため個別インストール不要）
- DB: H2（インメモリ、雛形確認用。本番用のPostgreSQL接続は未実装）

## 起動方法

ターミナルで `backend` フォルダに移動して以下を実行する。

```
cd backend
JAVA_HOME=/opt/homebrew/opt/openjdk@25 ./gradlew bootRun
```

初回はGradle本体のダウンロードとビルドが走るため、起動まで数分かかる。
「Started BackendApplication」というログが表示されたら起動完了。

停止するときはターミナルで `Ctrl + C`。

## 動作確認

サーバー起動後、別のターミナルで以下を実行する。

```
curl http://localhost:8080/api/health
```

`{"status":"ok"}` が返れば正常に動作している。

## 補足
- `JAVA_HOME` を毎回指定しているのは、このマシンにJava 25がHomebrewの非標準の場所（keg-only）にインストールされているため。`/usr/libexec/java_home` にJava 25を登録すれば省略できるが、その場合は `sudo` 権限が必要になる。
