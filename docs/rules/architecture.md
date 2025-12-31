# アーキテクチャルール

このプロジェクトは **Feature-Sliced Design (FSD)** アーキテクチャを採用しています。

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
├── widgets/                # ページレベルコンポーネント
├── features/               # ユーザーアクション・ビジネスロジック
├── entities/               # ビジネスエンティティ
└── shared/                 # 再利用可能なコード
```

## レイヤー別ルール

### App Layer (`app/`)
- Next.js App Routerのルーティング
- ビジネスロジックを含まない
- Widgetsを組み立てるのみ

### Widgets Layer (`widgets/`)
- ページ全体またはページの大きなセクション
- 複数のfeaturesとentitiesを組み合わせる
- **依存可能**: features, entities, shared
- **依存禁止**: 他のwidgets

### Features Layer (`features/`)
- ユーザーのビジネス価値を提供する機能単位
- 特定のユーザーアクション
- **依存可能**: entities, shared
- **依存禁止**: 他のfeatures, widgets

### Entities Layer (`entities/`)
- ビジネスエンティティとコアロジック
- データモデル、ビジネスルール、API連携
- **依存可能**: shared のみ
- **依存禁止**: features, widgets

### Shared Layer (`shared/`)
- プロジェクト全体で再利用可能なコード
- UIコンポーネント、ユーティリティ、定数
- **依存禁止**: 他のすべてのレイヤー

## 依存関係ルール

```
app → widgets → features → entities → shared
```

### 重要な制約
1. **上位レイヤーのみ下位レイヤーに依存可能**
2. **同一レイヤー内での横断的依存禁止**
   - features同士で import しない
   - widgets同士で import しない
3. **逆方向の依存は絶対禁止**
   - shared が entities を import してはいけない
   - entities が features を import してはいけない

## Public API パターン

各レイヤーは `index.ts` を通じてのみ外部に機能を公開します。

### ✅ Good
```typescript
// entities/tech/index.ts で公開
export { TechStackService } from './model/TechStackService';

// 他のファイルから使用
import { TechStackService } from '@/entities/tech';
```

### ❌ Bad
```typescript
// 内部実装への直接アクセス
import { TechStackService } from '@/entities/tech/model/TechStackService';
```

## インポートパス規約

```typescript
// Entities
import { TechStackService, TechCategory } from '@/entities/tech';

// Features
import { useTechSelection } from '@/features/tech-selection';

// Widgets
import { GeneratorContainer } from '@/widgets/tech-stack-generator';

// Shared
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
```

## 新機能追加時のガイドライン

### 1. 新しいEntity追加
```
src/entities/[entity-name]/
├── model/          # データモデル・ビジネスロジック
├── api/            # 外部API連携
├── lib/            # ユーティリティ
├── ui/             # エンティティ固有のUI
└── index.ts        # Public API
```

### 2. 新しいFeature追加
```
src/features/[feature-name]/
├── model/          # フックス・サービス
├── ui/             # フィーチャー固有のUI
└── index.ts        # Public API
```

### 3. 新しいWidget追加
```
src/widgets/[widget-name]/
├── ui/             # UIコンポーネント
└── index.ts        # Public API
```

## ベストプラクティス

1. **Small Modules**: 各モジュールは単一責任を持つ
2. **Public API First**: 常にPublic API経由でアクセス
3. **Type Safety**: Zod + TypeScriptで型安全性を確保
4. **No Circular Dependencies**: 循環依存を避ける
5. **Clear Boundaries**: レイヤー間の境界を明確に保つ

## 参考資料

- [Feature-Sliced Design 公式](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
