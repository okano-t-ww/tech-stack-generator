# Git ワークフロー

## ブランチ戦略

### メインブランチ
- `main` - 本番環境
  - 常にデプロイ可能な状態を保つ
  - 直接pushは禁止

### 開発ブランチ
```
feature/[feature-name]  - 新機能開発
fix/[bug-name]          - バグ修正
refactor/[task-name]    - リファクタリング
docs/[doc-name]         - ドキュメント更新
```

## ブランチ命名規則

### ✅ Good
```
feature/add-dark-mode
fix/icon-loading-error
refactor/architecture-improvements
docs/update-readme
```

### ❌ Bad
```
new-feature
fix
my-branch
test123
```

## コミットメッセージ

### フォーマット
```
<type>: <subject>

<body>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント
- `style`: フォーマット（コード動作に影響なし）
- `test`: テスト追加・修正
- `chore`: ビルドプロセス・補助ツール変更

### Subject
- 50文字以内
- 動詞で始める（add, fix, update, remove）
- 小文字で始める
- 末尾にピリオドをつけない

### ✅ Good
```
feat: add dark mode toggle to settings
fix: resolve icon loading timeout issue
refactor: migrate to FSD architecture
docs: update installation guide
```

### ❌ Bad
```
Added new feature
fixed bug
Update
WIP
```

## プルリクエスト

### タイトル
コミットメッセージと同じ規則

### 説明テンプレート
```markdown
## Summary
<!-- 変更内容を簡潔に説明 -->

## Changes
- 変更点1
- 変更点2

## Test Plan
- [ ] ローカルビルド確認
- [ ] 機能テスト完了
- [ ] 既存機能に影響なし

## Screenshots (if applicable)
<!-- スクリーンショットを追加 -->
```

### レビュー前チェックリスト
- [ ] コードがビルド成功
- [ ] ESLintエラーなし
- [ ] 不要なコンソールログ削除
- [ ] コミットメッセージが規約に準拠
- [ ] 関連ドキュメント更新

## マージ戦略

### Squash Merge推奨
- PR内の複数コミットを1つにまとめる
- 履歴がシンプルになる

### マージ時のコミットメッセージ
```
feat: add user authentication (#123)

- Implement login/logout functionality
- Add JWT token management
- Create user profile page

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## コミット前のチェック

```bash
# ビルド確認
npm run build

# Lint確認
npm run lint

# 型チェック
npx tsc --noEmit
```

## .gitignore

必ず無視するファイル:
```
node_modules/
.next/
.env.local
.DS_Store
*.log
coverage/
.vscode/
.idea/
```

## 大きなファイルの扱い

- **画像**: 可能な限り最適化
- **動画**: Git LFS使用を検討
- **バイナリ**: リポジトリに含めない

## セキュリティ

### 絶対にコミットしてはいけないもの
- API キー
- パスワード
- 秘密鍵
- `.env` ファイル（`.env.example`はOK）

### 万が一コミットしてしまった場合
```bash
# 最新コミットから削除（まだpushしていない場合）
git rm --cached .env
git commit --amend

# 履歴から完全削除（既にpushした場合）
# リポジトリ管理者に相談すること
```

## 便利なGitコマンド

### ステージング
```bash
# 変更を部分的にステージ
git add -p

# すべての変更をステージ
git add .
```

### コミット修正
```bash
# 直前のコミットを修正
git commit --amend

# コミットメッセージのみ修正
git commit --amend -m "new message"
```

### ブランチ操作
```bash
# ブランチ作成と切り替え
git checkout -b feature/new-feature

# ブランチ削除
git branch -d feature/old-feature

# リモートブランチ追跡
git checkout -b feature/new-feature origin/feature/new-feature
```

### 履歴確認
```bash
# コミット履歴
git log --oneline --graph

# ファイルの変更履歴
git log -p <file>

# 特定の人のコミット
git log --author="name"
```

## トラブルシューティング

### コンフリクト解決
```bash
# 1. 競合ファイルを確認
git status

# 2. ファイルを編集して競合を解決

# 3. 解決したファイルをステージ
git add <resolved-file>

# 4. マージを完了
git commit
```

### 間違ったコミットの取り消し
```bash
# 直前のコミットを取り消し（変更は保持）
git reset --soft HEAD^

# 直前のコミットを完全に取り消し
git reset --hard HEAD^

# 特定のコミットを打ち消す（安全）
git revert <commit-hash>
```
