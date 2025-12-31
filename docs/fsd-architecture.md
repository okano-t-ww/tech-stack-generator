# Feature-Sliced Design (FSD) Architecture

## 概要

このプロジェクトはFeature-Sliced Design (FSD)アーキテクチャを採用しています。FSDは高凝集・疎結合を実現し、スケーラブルで保守性の高いフロントエンドアーキテクチャです。

## ディレクトリ構造

```
src/
├── app/                    # アプリケーション層（Next.js App Router）
├── widgets/                # ウィジェット層（ページレベルのコンポーネント）
│   └── tech-stack-generator/
│       ├── ui/
│       │   └── GeneratorContainer.tsx
│       └── index.ts        # Public API
├── features/               # フィーチャー層（ユーザーアクション）
│   ├── tech-selection/
│   │   ├── model/
│   │   │   └── useTechSelection.ts
│   │   └── index.ts
│   ├── markdown-generation/
│   │   ├── model/
│   │   │   ├── MarkdownService.ts
│   │   │   └── useMarkdownGenerator.ts
│   │   └── index.ts
│   └── icon-display/
│       ├── model/
│       │   └── useTechIcon.ts
│       └── index.ts
├── entities/               # エンティティ層（ビジネスエンティティ）
│   └── tech/
│       ├── model/
│       │   ├── techStackData.ts
│       │   ├── types.ts
│       │   └── TechStackService.ts
│       ├── api/
│       │   └── iconify.ts
│       └── index.ts        # Public API
├── shared/                 # 共有層（再利用可能なUI・ユーティリティ）
│   ├── ui/                 # shadcn/ui コンポーネント
│   └── lib/
└── components/             # レガシーコンポーネント（段階的に移行予定）
```

## レイヤー説明

### 1. App Layer (`app/`)

Next.js App Routerのルーティング層。

- ページコンポーネントは薄く、widgetsを組み立てるのみ
- ビジネスロジックを含まない

**例:**
```tsx
import { GeneratorContainer } from "@/widgets/tech-stack-generator";

export default function Home() {
  return <GeneratorContainer />;
}
```

### 2. Widgets Layer (`widgets/`)

ページレベルの独立したコンポーネント。複数のfeaturesとentitiesを組み合わせる。

- **責務**: ページ全体またはページの大きなセクションを構成
- **依存**: features, entities, shared
- **禁止**: 他のwidgetsに依存しない

**例:** `tech-stack-generator/`
- Tech Stack生成機能全体を提供
- 検索、フィルタリング、Markdown生成などを統合

### 3. Features Layer (`features/`)

ユーザーのビジネス価値を提供する機能単位。

- **責務**: 特定のユーザーアクション（Tech選択、Markdown生成など）
- **依存**: entities, shared
- **禁止**: 他のfeaturesに依存しない

**例:**
- `tech-selection/`: Tech一覧の選択・管理
- `markdown-generation/`: Markdown生成ロジック
- `icon-display/`: アイコン表示機能

### 4. Entities Layer (`entities/`)

ビジネスエンティティとコアロジック。

- **責務**: データモデル、ビジネスルール、API連携
- **依存**: shared のみ
- **禁止**: features, widgets に依存しない

**例:** `tech/`
```
tech/
├── model/                  # データモデルとビジネスロジック
│   ├── techStackData.ts   # Tech Stackデータ
│   ├── types.ts           # 型定義・Zodスキーマ
│   └── TechStackService.ts # ビジネスロジック
├── api/                   # 外部API連携
│   └── iconify.ts         # Iconify API
└── index.ts               # Public API（外部に公開する機能のみ）
```

### 5. Shared Layer (`shared/`)

プロジェクト全体で再利用可能なコード。

- **責務**: UI コンポーネント、ユーティリティ、定数
- **依存**: なし（他のレイヤーに依存しない）

**例:**
- `ui/`: shadcn/uiコンポーネント
- `lib/`: ユーティリティ関数

## Public API Pattern

各レイヤーは `index.ts` を通じてのみ外部に機能を公開します。

### Entities Public API 例

```typescript
// entities/tech/index.ts
export { TECH_STACK, TECH_STACK_LIST } from './model/techStackData';
export { TechStackService } from './model/TechStackService';
export { TechCategory } from './model/types';
export type { TechItem, TechId, IconifyId } from './model/types';
export { IconifyService } from './api/iconify';
```

### Features Public API 例

```typescript
// features/tech-selection/index.ts
export { useTechSelection } from './model/useTechSelection';
```

### 重要ルール

1. **内部実装への直接アクセス禁止**
   ```typescript
   // ❌ Bad
   import { useTechSelection } from '@/features/tech-selection/model/useTechSelection';

   // ✅ Good
   import { useTechSelection } from '@/features/tech-selection';
   ```

2. **上位レイヤーのみ下位レイヤーに依存**
   ```
   app → widgets → features → entities → shared
   ```

3. **同一レイヤー内での横断的依存禁止**
   - features同士で import しない
   - entities同士で import しない（同一entity内はOK）

## インポートパス規約

```typescript
// Entities
import { TechStackService, TechCategory } from '@/entities/tech';

// Features
import { useTechSelection } from '@/features/tech-selection';
import { MarkdownService } from '@/features/markdown-generation';

// Widgets
import { GeneratorContainer } from '@/widgets/tech-stack-generator';

// Shared
import { Button } from '@/shared/ui/button';
```

## 移行履歴

### Before (旧構造)
```
src/
├── constants/techStack.ts
├── types/tech.ts
├── components/generator/
└── features/tech-stack-generator/
```

### After (FSD)
```
src/
├── entities/tech/
├── features/{tech-selection,markdown-generation,icon-display}/
└── widgets/tech-stack-generator/
```

### 移行で実施したこと

1. **Entities層の構築**
   - `constants/techStack.ts` → `entities/tech/model/techStackData.ts`
   - `types/tech.ts` → `entities/tech/model/types.ts`
   - Services を entities/tech に集約

2. **Features層の構築**
   - Hooks を機能別にフィーチャーに分割
   - `useTechSelection` → `features/tech-selection/`
   - `useMarkdownGenerator` → `features/markdown-generation/`
   - `useTechIcon` → `features/icon-display/`

3. **Widgets層の構築**
   - `GeneratorContainer` → `widgets/tech-stack-generator/`

4. **Public API の作成**
   - 各レイヤーに `index.ts` を作成
   - 外部に公開する機能のみエクスポート

5. **インポートパスの更新**
   - 全ファイルのimportをPublic API経由に変更

## 今後の拡張

新しい機能を追加する際の指針:

### 1. 新しいEntity追加

```
src/entities/user/
├── model/
│   ├── types.ts
│   ├── UserService.ts
│   └── userData.ts
├── api/
│   └── userApi.ts
└── index.ts
```

### 2. 新しいFeature追加

```
src/features/user-profile/
├── model/
│   └── useUserProfile.ts
├── ui/
│   └── UserProfileCard.tsx
└── index.ts
```

### 3. 新しいWidget追加

```
src/widgets/user-dashboard/
├── ui/
│   └── Dashboard.tsx
└── index.ts
```

## ベストプラクティス

1. **Small Modules**: 各モジュールは単一責任を持つ
2. **Public API First**: 常にPublic API経由でアクセス
3. **Type Safety**: Zod + TypeScriptで型安全性を確保
4. **No Circular Dependencies**: 循環依存を避ける
5. **Clear Boundaries**: レイヤー間の境界を明確に保つ

## 参考資料

- [Feature-Sliced Design 公式ドキュメント](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
