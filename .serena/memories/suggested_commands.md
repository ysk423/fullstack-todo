# Suggested Commands

**状態: 未確定**（プロジェクト初期フェーズ、tech stack 未決定）

## Windows / PowerShell 固有の注意

- 環境変数: `$env:VAR_NAME`（bash の `$VAR_NAME` ではない）
- パス区切り: `\`（バックスラッシュ）
- コマンド継続: バッククォート `` ` ``（bash の `\` ではない）
- `ls` は `Get-ChildItem` のエイリアス（動作はほぼ同じ）
- `grep` 相当: `Select-String` または `rg`（ripgrep 推奨）

## Git

```powershell
git log --oneline
git status
git diff
```

実装開始時に dev/test/lint/build コマンドを追記すること。
