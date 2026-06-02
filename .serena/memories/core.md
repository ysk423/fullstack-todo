# Core

**fullstack-todo** — フルスタック Todo アプリ（React + Express + SQLite）。

## ディレクトリ構成

```
fullstack-todo/
├── backend/          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── app.ts          # Express アプリ定義
│   │   ├── index.ts        # サーバー起動エントリーポイント
│   │   ├── todos.router.ts # /api/todos の CRUD ルーター
│   │   ├── db.ts           # node:sqlite ラッパー（getDb / resetDb）
│   │   └── __tests__/todos.test.ts
│   └── package.json
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx         # Todo UI コンポーネント（単一ファイル）
│   │   ├── __tests__/App.test.tsx
│   │   └── test/setup.ts
│   └── package.json
└── package.json      # ルート（npm test で両方を実行）
```

## API エンドポイント

- `GET    /api/todos`       → Todo 一覧
- `POST   /api/todos`       → Todo 作成（body: `{ title: string }`）
- `PUT    /api/todos/:id`   → Todo 更新（body: `{ title?, completed? }`）
- `DELETE /api/todos/:id`   → Todo 削除

## 参照

- 技術スタック詳細: `mem:tech_stack`
- 開発・テストコマンド: `mem:suggested_commands`
- TDD 規約: `mem:conventions`
- タスク完了コマンド: `mem:task_completion`
