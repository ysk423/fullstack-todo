# Trello Clone App 開発指示書
 
JavaScript、React、Node.js を使用してフル機能の Trello 風 TODO アプリを作成してください。
 
## 必要な機能要件
 
### 基本機能
 
1. **リスト管理**
   - リストの作成（タイトル入力）
   - リストの削除（確認ダイアログ付き）
   - リストの並び替え（ドラッグ&ドロップ）
   - リストの位置情報を数値で管理
2. **カード管理**
   - カードの作成（リスト内でタイトル入力）
   - カードの削除（確認ダイアログ付き）
   - カード間の並び替え（ドラッグ&ドロップ）
   - 異なるリスト間でのカード移動
   - カードの位置情報を数値で管理
3. **カード詳細編集**
   - カードタイトルの編集
   - 説明文の追加・編集
   - 期限日の設定
   - 完了状態のチェックボックス
   - モーダルウィンドウでの編集 UI
4. **UI/UX 要件**
   - Trello ライクなカード型デザイン
   - 直感的なドラッグ&ドロップ操作
   - レスポンシブ対応
   - 視覚的なフィードバック
 
## 技術仕様
 
### プロジェクト構成
 
```
trello-clone-app/
├── api/                   # バックエンド
│   ├── entities/         # データモデル
│   ├── datasource.js     # DB設定
│   └── index.js          # API サーバー
└── client/               # フロントエンド
    └── src/
        ├── lib/api/      # API通信
        ├── modules/      # 状態管理・データ層
        └── pages/        # UI コンポーネント
 
```
 
## バックエンド API 要件
 
### データモデル設計
 
**List（リスト）エンティティ**を以下のフィールドで設計：
 
- 主キー、タイトル、位置情報、作成・更新日時
 
**Card（カード）エンティティ**を以下のフィールドで設計：
 
- 主キー、タイトル、説明文、位置情報、完了状態、期限日、所属リスト ID、作成・更新日時
 
### API 設計要件
 
**RESTful API エンドポイント**を以下の詳細仕様で実装：
 
### リスト操作 API
 
- **POST /lists**: 新規リスト作成
  - リクエスト: `{ title: string }`
  - 新規リストの position: 既存リストの最大 position + 1（初回は 0）
  - レスポンス: 作成されたリストオブジェクト
- **GET /lists**: 全リスト取得
  - position 昇順でソート済みの配列を返却
- **PUT /lists**: リスト情報更新
  - リクエスト: `{ lists: Array<ListObject> }`
  - 配列形式で複数リストの一括更新に対応
  - レスポンス: 更新されたリスト配列
- **DELETE /lists/:id**: リスト削除
  - 該当リストの存在確認後に削除実行
  - 関連カードも自動削除（CASCADE 設定）
 
### カード操作 API
 
- **POST /cards**: 新規カード作成
  - リクエスト: `{ title: string, listId: number }`
  - 新規カードの position: 該当リスト内の既存カードの最大 position + 1（初回は 0）
  - レスポンス: 作成されたカードオブジェクト
- **GET /cards**: 全カード取得
  - position 昇順でソート済みの配列を返却
- **PUT /cards**: カード情報更新
  - リクエスト: `{ cards: Array<CardObject> }`
  - 配列形式で複数カードの一括更新に対応（ドラッグ&ドロップ時に使用）
  - レスポンス: 更新されたカード配列
- **DELETE /cards/:id**: カード削除
  - 該当カードの存在確認後に削除実行
 
### 技術要件
 
- **Express.js**で API サーバー構築
- **SQLite**でデータ永続化
- **ES Modules**形式でモジュール管理
- **CORS**有効化でフロントエンド連携
- **適切な HTTP ステータスコード**とエラーレスポンス
 
## フロントエンド React アプリ 要件
 
### 基本構成
 
- **フレームワーク**: React + Vite
- **状態管理**: Jotai（軽量な atomic state 管理）
- **ドラッグ&ドロップ**: @hello-pangea/dnd
- **HTTP 通信**: axios
- **スタイリング**: CSS（Trello 風デザイン）
 
### アーキテクチャパターン
 
### 1. Repository Pattern
 
- API アクセス層の抽象化
- `listRepository`, `cardRepository`で CRUD 操作
- エンティティクラスでデータ変換
 
### 2. Atomic State Management
 
- `listsAtom`: 全リスト状態
- `cardsAtom`: 全カード状態
- `selectedCardIdAtom`: 選択中カード ID
- `selectedCardAtom`: 計算された選択中カード
 
### 3. Component Structure
 
- `Home`: メインページ（データ取得・状態初期化）
- `SortableBoard`: ドラッグ&ドロップボード
- `SortableList`: 個別リストコンポーネント
- `SortableCard`: 個別カードコンポーネント
- `CardModal`: カード詳細編集モーダル
- `AddList`: リスト追加コンポーネント
- `AddCard`: カード追加コンポーネント
 
### 実装すべき機能詳細
 
### ドラッグ&ドロップ機能の詳細仕様
 
**1. ドラッグ&ドロップの基本構造**
 
- `DragDropContext`で全体のドラッグ操作を管理
- `onDragEnd`イベントハンドラーで`result`オブジェクトから移動情報を取得
- `result.type`で"list"と"card"を明確に区別して処理を分岐
- `destination`が null の場合は操作をキャンセル
 
**2. ID 管理とコンテキスト分離**
 
- リスト用 droppableId: `"board"`（ボード全体）
- カード用 droppableId: `"list-${listId}"`（各リスト内）
- リスト用 draggableId: `"list-${listId}"`
- カード用 draggableId: `"card-${cardId}"`
- この命名規則を厳密に守ってリストとカードの混同を防ぐ
 
**3. リスト並び替えの詳細処理**
 
- `result.type === "list"`の場合のみリスト並び替え処理を実行
- 配列操作: 移動元インデックスから要素を削除、移動先インデックスに挿入
- position 値の再計算: 新しい配列の各要素に index 番号を position 値として設定
- 楽観的 UI 更新: API コール前に状態を更新、エラー時に元の状態に復元
 
**4. カード移動の詳細処理**
 
- `result.type === "card"`の場合のみカード移動処理を実行
- 同一リスト内移動: `source.droppableId === destination.droppableId`で判定
- 異なるリスト間移動: 移動元リストから削除、移動先リストに追加
- listId 更新: 異なるリスト間移動時は`destination.droppableId`から listId を抽出
- position 値の一括再計算: 影響を受ける全カードの position 値を配列インデックスで更新
 
**5. パフォーマンス最適化**
 
- ドラッグ中の不要な再レンダリング防止: `React.memo`でコンポーネントをメモ化
- 状態更新の最小化: 必要な範囲のみを更新
- position 値の効率的な計算: 配列操作後に一度だけまとめて再計算
- API 呼び出しの最適化: 複数要素の一括更新 API を活用
 
**6. エラーハンドリングと rollback**
 
- ドラッグ操作前の元状態を保存: `originalLists`、`originalCards`
- API 呼び出し失敗時の状態復元: `setLists(originalLists)`で即座に UI 復元
- ユーザーフィードバック: エラー発生時は console.error でログ出力
- ネットワークエラー対応: API 失敗時も操作を続行可能な設計
 
### カード詳細モーダル
 
- タイトル編集（textarea、50 文字制限）
- 説明文編集（textarea、200 文字制限）
- 期限日設定（date input）
- 完了チェックボックス
- 保存・削除ボタン
- モーダル外クリックで閉じる
 
### UI/UX 実装の詳細要件
 
**1. ドラッグ&ドロップ UI**
 
- ドラッグ中の視覚的フィードバック: ドラッグ対象を半透明化
- ドロップ可能エリアのハイライト: 境界線や background 色の変更
- ドラッグプレビューの最適化: 元の要素サイズを保持
- スムーズなアニメーション: CSS トランジションでスムーズな移動
 
**2. カード表示とフィルタリング**
 
- リスト別カード表示: `cards.filter(card => card.listId === listId)`でリスト別に分離
- position 順での表示: `filteredCards.sort((a, b) => a.position - b.position)`
- カードクリック時のモーダル表示: `setSelectedCardId(cardId)`で状態管理
 
**3. レスポンシブ対応**
 
- 横スクロール対応: `.board-container`で overflow-x: auto
- モバイル対応: タッチ操作でのドラッグ&ドロップサポート
- 画面サイズ対応: カード幅の調整とリスト間の適切な間隔
 
**4. パフォーマンス最適化**
 
- コンポーネントメモ化: リスト・カードコンポーネントの不要な再レンダリング防止
- 仮想化: 大量データ対応（必要に応じて）
- 状態更新の最適化: 変更された部分のみを更新
 
## 開発・実装の流れ
 
### 1. 環境セットアップ
 
- バックエンド: `express cors sqlite3 typeorm reflect-metadata nodemon`
- フロントエンド: `@hello-pangea/dnd axios jotai`
- 環境変数: `VITE_API_URL=http://localhost:8888`
 
### 2. バックエンド実装順序
 
1. TypeORM エンティティ定義（List, Card）
2. データベース接続設定
3. Express API ルート実装
4. エラーハンドリング
5. CORS 設定
 
### 3. フロントエンド実装順序
 
1. API クライアント設定
2. Jotai 状態管理セットアップ
3. Repository パターン実装
4. 基本コンポーネント作成（データ表示のみ）
5. **ドラッグ&ドロップ機能実装**（重要な段階的実装）
   - Step1: DragDropContext 設置と onDragEnd 基本処理
   - Step2: リスト用 Droppable/Draggable 設定（type="list"）
   - Step3: カード用 Droppable/Draggable 設定（type="card"）
   - Step4: 同一リスト内カード移動実装
   - Step5: 異なるリスト間カード移動実装
   - Step6: エラーハンドリングと rollback 実装
6. モーダル機能実装
7. スタイリング
 
### ドラッグ&ドロップライブラリ設定の詳細
 
**1. DragDropContext 設定**
 
- 最上位コンポーネントでラップ
- onDragEnd 関数で全ドラッグ操作を制御
- result.type で list/card 処理を分岐
 
**2. Droppable 設定**
 
- リスト用: `droppableId="board"`, `type="list"`, `direction="horizontal"`
- カード用: `droppableId="list-${listId}"`, `type="card"`, `direction="vertical"`
 
**3. Draggable 設定**
 
- リスト用: `draggableId="list-${listId}"`, `index={arrayIndex}`
- カード用: `draggableId="card-${cardId}"`, `index={arrayIndex}`
- **重要**: index には配列の実際のインデックスを使用（position 値ではない）
 
### 4. 重要な実装ポイント
 
### ポジション管理の詳細仕様
 
**1. リストの position 管理**
 
- 新規リスト作成時: 既存リストの最大 position 値 + 1 を設定
- リスト並び替え時: 並び替え後の配列インデックスをそのまま position 値に設定
- position 値による表示順制御: `lists.sort((a, b) => a.position - b.position)`で常にソート
 
**2. カードの position 管理**
 
- 新規カード作成時: 対象リスト内の既存カードの最大 position 値 + 1 を設定
- **注意**: `maxPosition + 1` ではなく `maxPosition` をそのまま使用していますが、これは position 値の重複を引き起こすバグです。必ず +1 を追加してください
- 同一リスト内移動時: そのリスト内カードの配列を並び替え、インデックスを position 値に設定
- 異なるリスト間移動時:
  - 移動元リスト: 残ったカードの position 値を再計算（0 から連番）
  - 移動先リスト: 挿入後のカード配列の position 値を再計算（0 から連番）
- position 値計算の一元化: `updateCardsPosition`関数で共通処理
 
**3. データ整合性の保証**
 
- フロントエンド状態とデータベースの同期: position 値変更時は必ず API 更新
- ソート順の統一: 取得時も更新後も必ず position 昇順でソート
- position 値の重複回避: 配列インデックス使用で重複を完全に防止
 
### エラーハンドリング
 
- API エラー時の適切なメッセージ表示
- ドラッグ操作失敗時の rollback
- ネットワークエラー対応
 
### パフォーマンス
 
- 状態更新の最小化
- 不要な再レンダリング防止
- API 呼び出しの最適化
 
## 成功基準と検証ポイント
 
### 機能検証
 
1. **ドラッグ&ドロップ機能**
   - ✅ リストとカードのドラッグが混同されない（type 分離）
   - ✅ ドラッグ中の UI が崩れない（CSS 設定とメモ化）
   - ✅ ドロップ後の順序変更が正確に反映される（position 管理）
   - ✅ 異なるリスト間のカード移動が正常動作（listId 更新）
   - ✅ エラー時に元の状態に復元される（rollback 機能）
2. **データ整合性**
   - ✅ 新規作成時の position 値が適切（最大値+1）
   - ✅ リロード後も並び順が維持される（DB 永続化）
   - ✅ 複数ユーザーでの同時操作（基本的な整合性）
3. **UI/UX 品質**
   - ✅ 元アプリと同等の見た目とレイアウト
   - ✅ スムーズなドラッグアニメーション
   - ✅ 適切なフィードバック（ホバー、フォーカス）
   - ✅ モバイル対応（タッチ操作）
4. **パフォーマンス**
   - ✅ 大量データでも快適な操作（50+リスト、500+カード）
   - ✅ 不要な再レンダリングの防止
   - ✅ API レスポンス時間の最適化
 
### デバッグチェックポイント
 
**ドラッグ&ドロップで問題が起きた場合の確認項目:**
 
1. `result.type`で正しく分岐処理されているか
2. `droppableId`と`draggableId`の命名規則が統一されているか
3. position 値の計算ロジックが正確か
4. エラー時の state 復元処理が実装されているか
5. 配列操作が元配列を変更していないか（immutable 更新）
6. **リスト間移動時のカード消失問題**: 異なるリスト間でカードを移動する際、移動したカードが新しい配列に正しく追加されているか確認すること
   - 移動元リストから削除されたカードは`null`になり`filter(Boolean)`で除去される
   - 移動先リストに新しく追加されたカードを明示的に配列に追加する必要がある
   - 配列の`map`処理だけでは新しいカードは追加されないため、別途`addedCards`を計算して結合する
 
**パフォーマンス問題の確認項目:**
 
1. React DevTools での不要な再レンダリング確認
2. コンポーネントのメモ化実装確認
3. 状態更新の範囲が最小化されているか
 
## スタイリング要件
 
基本的な CSS 設定で以下の Trello 風デザインを実装：
 
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
 
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    sans-serif;
  background: linear-gradient(to bottom right, #7c3aed, #a855f7, #c084fc);
  min-height: 100vh;
}
 
.header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}
 
.trello-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: white;
}
 
.board-container {
  padding: 20px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
}
```
 
## 技術スタック要約
 
**バックエンド**: Node.js, Express, TypeORM, SQLite, JavaScript ES6+
 
**フロントエンド**: React, Vite, Jotai, @hello-pangea/dnd, Axios, JavaScript
 
**開発ツール**: nodemon, Vite dev server