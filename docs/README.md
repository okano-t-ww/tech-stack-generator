# Tech Stack Generator - ドキュメント

## 📚 ドキュメント構成

### Rules (開発ルール)
プロジェクトの開発規約とガイドライン

- **[architecture.md](rules/architecture.md)** - FSDアーキテクチャルール
- **[coding-standards.md](rules/coding-standards.md)** - コーディング規約
- **[functional-programming.md](rules/functional-programming.md)** - 関数型プログラミング原則
- **[git-workflow.md](rules/git-workflow.md)** - Git運用ルール

### Reference (参考資料)
技術仕様と移行情報

- **[fsd-architecture.md](fsd-architecture.md)** - FSD構造の詳細説明
- **[cleanup-and-tailwind-v4.md](cleanup-and-tailwind-v4.md)** - Tailwind CSS v4移行ガイド

## 🎯 クイックリンク

### 新規参加者向け
1. [アーキテクチャルール](rules/architecture.md) を読む
2. [コーディング規約](rules/coding-standards.md) を確認
3. [Git運用ルール](rules/git-workflow.md) に従う

### 機能追加時
1. [FSDアーキテクチャ](rules/architecture.md#新機能追加時のガイドライン) の該当レイヤーを確認
2. Public APIパターンに従う
3. 依存関係ルールを遵守

### アーキテクチャ理解
- [FSD詳細説明](fsd-architecture.md) を参照
- レイヤー別の責務を理解
- 実際のディレクトリ構造を確認

## 🏗️ プロジェクト構造

```
src/
├── app/              # Next.js App Router
├── widgets/          # ページレベルコンポーネント
├── features/         # ビジネスロジック
├── entities/         # データモデル
└── shared/           # 再利用可能コード
```

## 📖 主要技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Architecture**: Feature-Sliced Design (FSD)
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Validation**: Zod v4
- **State**: React Hooks

## 🔗 外部リンク

- [Feature-Sliced Design 公式](https://feature-sliced.design/)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
