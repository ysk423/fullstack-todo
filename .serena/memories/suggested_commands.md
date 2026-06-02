# Suggested Commands

## 開発サーバー起動

```bash
# バックエンド (port 3001)
npm --prefix backend run dev

# フロントエンド (port 5173, /api → 3001 にプロキシ)
npm --prefix frontend run dev
```

## テスト

```bash
# 全テスト（ルートから）
npm test

# バックエンドのみ
npm --prefix backend test
# または
cd backend && npm test

# フロントエンドのみ
npm --prefix frontend test
# または
cd frontend && npm test
```

## Windows / PowerShell 固有の注意

- 環境変数: `$env:VAR_NAME`（bash の `$VAR_NAME` ではない）
- パス区切り: `\`（ただし npm スクリプト内では `/` も可）
- コマンド継続: バッククォート `` ` ``
