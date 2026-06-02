# Task Completion

コーディングタスク完了時に必ず実行するコマンド:

```bash
# ルートから全テストを実行
npm test
```

## 完了基準（TDD）

1. バックエンドテスト全パス（`backend/src/__tests__/todos.test.ts`）
2. フロントエンドテスト全パス（`frontend/src/__tests__/App.test.tsx`）
3. TypeScript コンパイルエラーなし

## TDD の流れ

1. テストを書く → `npm test` で失敗を確認（Red）
2. 失敗を確認したらコミット
3. 実装する → `npm test` で通過を確認（Green）
4. 全テスト通過でコミット

`mem:conventions` の TDD ルールも参照。
