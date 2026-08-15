# GitHub運用ルール

このプロジェクトでは、以下のルールを必ず守って開発を進める。Claude Codeがこのリポジトリで作業する際は、セッションをまたいで常にこのルールに従うこと。

## 1. Issueを起票する

機能追加・修正など、まとまった作業を始める前にGitHub Issueを起票する。
着手前にIssueが存在しない場合は、作業を始める前にユーザーに確認するか、Issueを作成する。

## 2. 作業用ブランチを切る

mainブランチで直接作業しない。必ず対応するIssueに紐づくブランチを作成する。

- ブランチ名: `feature/<issue番号>-<内容を表す短い英語>`
  - 例: `feature/12-add-postgres-connection`

## 3. mainへの直接pushは禁止

mainブランチへの変更は、必ずPull Request経由で行う。
GitHub側でもmainブランチにBranch protection（PR必須化）を設定済みのため、直接pushは技術的にも拒否される。

## 4. マージの流れ

1. Issueを起票する
2. `feature/<issue番号>-<内容>` ブランチを作成する
3. ブランチ上で作業・コミットする
4. Pull Requestを作成する
5. Pull Request経由でmainにマージする

この流れを外れる作業（mainへの直接コミット・直接push）は行わない。
