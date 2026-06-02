# Task Completion

**状態: 未確定**（tech stack 未決定のため具体的コマンドなし）

## TDD サイクルでの完了基準

1. すべてのテストが通過している
2. linter エラーがない
3. 型チェックが通る（静的型付き言語の場合）
4. コミット済み（テスト失敗確認後・実装完了後の2段階）

## 実装開始後に追記すること

- テストランナーコマンド（例: `npm test`, `pytest`, `go test ./...`）
- linter コマンド（例: `npm run lint`, `ruff check .`）
- formatter コマンド
- 型チェッカーコマンド（例: `tsc --noEmit`, `mypy .`）
- ビルドコマンド

`mem:suggested_commands` と合わせて参照。
