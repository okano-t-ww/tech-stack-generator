# Lite FSD + Vertical Slice Architecture

## コンセプト

**Lite FSD (Feature-Sliced Design)** と **Vertical Slice Architecture** を組み合わせた実用的なアーキテクチャ。

### 核となる思想

1. **Vertical Slice**: 機能を縦に切る（フルスタックで完結）
2. **Lite FSD**: FSDの3層構造のみを採用（app, features, shared）
3. **高凝集・疎結合**: 各スライスは独立、依存は明確に

---

## アーキテクチャ概要

### 3層構造（Lite FSD）

```
┌─────────────────────────────────┐
│   app/                          │ ← アプリケーション初期化・ルーティング
│   (Next.js App Router)          │
└────────────┬────────────────────┘
             │ uses
             ↓
┌─────────────────────────────────┐
│   features/                     │ ← ビジネス機能（Vertical Slices）
│   (機能ごとに垂直統合)           │
└────────────┬────────────────────┘
             │ uses
             ↓
┌─────────────────────────────────┐
│   shared/                       │ ← 共有コード・UIライブラリ
│   (再利用可能なコンポーネント)    │
└─────────────────────────────────┘
```

---

## ディレクトリ構造

### 全体像

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   └── page.tsx
│
├── features/                     # ★ Vertical Slices
│   └── tech-stack-generator/    # 1つの完結した機能
│       ├── ui/                   # UIコンポーネント
│       │   ├── TechSelector/
│       │   ├── MarkdownOutput/
│       │   └── TechIconGrid/
│       ├── model/                # ビジネスロジック
│       │   ├── hooks/
│       │   ├── services/
│       │   └── store/
│       ├── api/                  # 外部API連携
│       │   └── iconify.ts
│       ├── lib/                  # 機能固有ユーティリティ
│       │   └── validators.ts
│       ├── types/                # 機能固有型定義
│       │   └── index.ts
│       ├── constants/            # 機能固有定数
│       │   └── techStackData.ts
│       └── index.ts              # ★ Public API
│
└── shared/                       # 共有コード
    ├── ui/                       # 共有UIコンポーネント
    │   ├── primitives/           # shadcn/ui等
    │   └── components/           # カスタム共有コンポーネント
    ├── lib/                      # ユーティリティ関数
    │   └── utils.ts
    ├── hooks/                    # 共有カスタムフック
    │   └── use-toast.ts
    ├── config/                   # アプリ設定
    │   └── constants.ts
    └── types/                    # 共有型定義
        └── common.ts
```

---

## Vertical Slice の構造

### 1つのスライス = 完結した機能

各 feature は **自己完結型**：

```
features/tech-stack-generator/
├── ui/                    # このスライスのUI
├── model/                 # このスライスのロジック
├── api/                   # このスライスのAPI
├── lib/                   # このスライスのヘルパー
├── types/                 # このスライスの型
├── constants/             # このスライスのデータ
└── index.ts              # Public API（外部公開インターフェース）
```

### Public API パターン

```typescript
// features/tech-stack-generator/index.ts
// ★ 外部から使える機能のみエクスポート

// UI Components
export { TechStackGenerator } from './ui/TechStackGenerator';

// Hooks（必要な場合のみ）
export { useTechSelection } from './model/hooks/useTechSelection';

// Types（外部で必要な場合のみ）
export type { TechItem, TechCategory } from './types';

// ❌ 内部実装の詳細はエクスポートしない
// - services/
// - lib/
// - constants/
```

---

## 詳細設計

### features/tech-stack-generator/ の内部構造

#### 1. ui/ - UIコンポーネント層

```
ui/
├── TechStackGenerator.tsx        # ★ メインコンポーネント（公開）
├── TechSelector/                 # Tech選択UI
│   ├── TechSelector.tsx
│   ├── TechToggleButton.tsx
│   └── CategoryTabs.tsx
├── MarkdownOutput/               # Markdown出力UI
│   ├── MarkdownOutput.tsx
│   ├── OutputFormatSelector.tsx
│   └── CopyButton.tsx
└── TechIconGrid/                 # アイコングリッドUI
    ├── TechIconGrid.tsx
    ├── TechIcon.tsx
    └── IconPreview.tsx
```

**特徴:**
- コンポーネントは機能単位でディレクトリ分け
- プレゼンテーションに集中（ロジックは model/ に委譲）

#### 2. model/ - ビジネスロジック層

```
model/
├── hooks/                        # カスタムフック
│   ├── useTechSelection.ts      # Tech選択状態管理
│   ├── useMarkdownGenerator.ts  # Markdown生成
│   └── useTechIcon.ts           # アイコン表示ロジック
│
├── services/                     # ビジネスロジック
│   ├── TechStackService.ts      # Tech Stack操作
│   ├── IconifyService.ts        # Iconify API連携
│   └── MarkdownService.ts       # Markdown生成ロジック
│
└── store/                        # 状態管理（必要な場合）
    └── techSelectionStore.ts
```

**特徴:**
- ビジネスロジックを集約
- UIから完全分離（テスト容易）

#### 3. api/ - 外部API層

```
api/
└── iconify.ts                    # Iconify API client
```

```typescript
// api/iconify.ts
export class IconifyApi {
  private static readonly BASE_URL = 'https://api.iconify.design';

  static getIconUrl(iconifyId: string, size: number = 48): string {
    return `${this.BASE_URL}/${iconifyId}.svg?width=${size}&height=${size}`;
  }

  static async validateIcon(iconifyId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/${iconifyId}.svg`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

#### 4. lib/ - ユーティリティ層

```
lib/
├── validators.ts                 # バリデーション関数
└── formatters.ts                 # フォーマット関数
```

#### 5. types/ - 型定義

```
types/
└── index.ts                      # 全型定義を集約
```

```typescript
// types/index.ts
import { z } from 'zod';

// Zod Schemas
export const TechIdSchema = z.string().min(1);
export const IconifyIdSchema = z.string().regex(/^(logos|simple-icons|devicon):[a-z0-9-]+$/);
export const TechLinkSchema = z.string().url();

// Types
export type TechId = z.infer<typeof TechIdSchema>;
export type IconifyId = z.infer<typeof IconifyIdSchema>;
export type TechLink = z.infer<typeof TechLinkSchema>;

export enum TechCategory {
  Language = 'language',
  Framework = 'framework',
  Library = 'library',
  // ...
}

export interface TechItem {
  id: TechId;
  name: string;
  category: TechCategory;
  iconify: IconifyId;
  link?: TechLink;
}

export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;
export type OutputFormat = 'single' | 'individual';
```

#### 6. constants/ - データ定義

```
constants/
└── techStackData.ts              # Tech Stack データ
```

---

## 実装例

### 1. Service Layer

```typescript
// features/tech-stack-generator/model/services/TechStackService.ts
import { TECH_STACK, TECH_STACK_LIST } from '../../constants/techStackData';
import type { TechItem, TechCategory, TechId } from '../../types';

/**
 * Tech Stack 管理サービス
 * データアクセス・検索・フィルタリングを提供
 */
export class TechStackService {
  /**
   * IDから取得
   */
  static getById(id: TechId): TechItem | undefined {
    return TECH_STACK[id as keyof typeof TECH_STACK];
  }

  /**
   * カテゴリでフィルタ
   */
  static filterByCategories(categories: TechCategory[]): TechItem[] {
    return TECH_STACK_LIST.filter((tech) => categories.includes(tech.category));
  }

  /**
   * キーワード検索
   */
  static search(keyword: string): TechItem[] {
    const query = keyword.toLowerCase();
    return TECH_STACK_LIST.filter((tech) =>
      tech.name.toLowerCase().includes(query)
    );
  }

  /**
   * リンク取得（フォールバック付き）
   */
  static getLink(tech: TechItem): string {
    if ('link' in tech && tech.link) {
      return tech.link;
    }
    return `https://simpleicons.org/?q=${encodeURIComponent(tech.name)}`;
  }

  /**
   * 全件取得
   */
  static getAll(): TechItem[] {
    return TECH_STACK_LIST;
  }
}
```

### 2. Custom Hook

```typescript
// features/tech-stack-generator/model/hooks/useTechSelection.ts
import { useState, useCallback } from 'react';
import type { TechItem } from '../../types';

/**
 * Tech選択状態を管理するフック
 */
export function useTechSelection(initialItems: TechItem[] = []) {
  const [selected, setSelected] = useState<TechItem[]>(initialItems);

  const toggle = useCallback((tech: TechItem) => {
    setSelected((prev) =>
      prev.some((item) => item.id === tech.id)
        ? prev.filter((item) => item.id !== tech.id)
        : [...prev, tech]
    );
  }, []);

  const selectAll = useCallback((items: TechItem[]) => {
    setSelected(items);
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  const isSelected = useCallback(
    (tech: TechItem) => selected.some((item) => item.id === tech.id),
    [selected]
  );

  const getSelectedIds = useCallback(
    () => selected.map((tech) => tech.id),
    [selected]
  );

  return {
    selected,
    toggle,
    selectAll,
    clear,
    isSelected,
    getSelectedIds,
    count: selected.length,
  };
}
```

### 3. UI Component

```typescript
// features/tech-stack-generator/ui/TechSelector/TechSelector.tsx
'use client';

import { useTechSelection } from '../../model/hooks/useTechSelection';
import { TechStackService } from '../../model/services/TechStackService';
import { TechToggleButton } from './TechToggleButton';
import type { TechCategory } from '../../types';

interface TechSelectorProps {
  categories: TechCategory[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function TechSelector({ categories, onSelectionChange }: TechSelectorProps) {
  const techs = TechStackService.filterByCategories(categories);
  const { selected, toggle, isSelected, getSelectedIds } = useTechSelection();

  const handleToggle = (tech: TechItem) => {
    toggle(tech);
    if (onSelectionChange) {
      // 次の状態を計算して渡す
      const nextSelected = isSelected(tech)
        ? selected.filter((t) => t.id !== tech.id)
        : [...selected, tech];
      onSelectionChange(nextSelected.map((t) => t.id));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {techs.map((tech) => (
        <TechToggleButton
          key={tech.id}
          tech={tech}
          isSelected={isSelected(tech)}
          onToggle={() => handleToggle(tech)}
        />
      ))}
    </div>
  );
}
```

### 4. Public API

```typescript
// features/tech-stack-generator/index.ts

/**
 * Tech Stack Generator Feature
 *
 * Public API - 外部から使用可能な機能のみエクスポート
 */

// Main Component
export { TechStackGenerator } from './ui/TechStackGenerator';

// Sub Components（必要に応じて公開）
export { TechSelector } from './ui/TechSelector/TechSelector';
export { MarkdownOutput } from './ui/MarkdownOutput/MarkdownOutput';
export { TechIconGrid } from './ui/TechIconGrid/TechIconGrid';

// Hooks（外部で必要な場合のみ）
export { useTechSelection } from './model/hooks/useTechSelection';
export { useMarkdownGenerator } from './model/hooks/useMarkdownGenerator';

// Types（外部で必要な型のみ）
export type {
  TechItem,
  TechCategory,
  TechId,
  IconifyId,
  OutputFormat,
  PerLine,
} from './types';

// Constants（外部で必要な場合のみ）
export { TECH_STACK_LIST } from './constants/techStackData';
```

---

## 依存関係のルール

### 依存の方向性

```
app/
  ↓ (imports)
features/tech-stack-generator/
  ↓ (imports)
shared/
```

### ルール

1. **app/ は features/ をインポート可能**
   ```typescript
   // app/page.tsx
   import { TechStackGenerator } from '@/features/tech-stack-generator';
   ```

2. **features/ は shared/ のみインポート可能**
   ```typescript
   // features/tech-stack-generator/ui/Component.tsx
   import { Button } from '@/shared/ui/primitives/button';
   import { cn } from '@/shared/lib/utils';
   ```

3. **features/ 間の依存は禁止**
   ```typescript
   // ❌ NG
   import { SomeHook } from '@/features/other-feature';

   // ✅ OK - 共有が必要なら shared/ に移動
   import { SomeHook } from '@/shared/hooks/someHook';
   ```

4. **内部実装の直接インポート禁止**
   ```typescript
   // ❌ NG - 内部実装に直接アクセス
   import { TechStackService } from '@/features/tech-stack-generator/model/services/TechStackService';

   // ✅ OK - Public API経由
   import { useTechSelection } from '@/features/tech-stack-generator';
   ```

---

## 移行戦略

### Phase 1: ディレクトリ構造の準備（30分）

```bash
mkdir -p src/features/tech-stack-generator/{ui,model/{hooks,services},api,lib,types,constants}
mkdir -p src/shared/{ui/{primitives,components},lib,hooks,config,types}
```

### Phase 2: Service層の作成（1時間）

1. `TechStackService.ts` を作成
2. `IconifyService.ts` を作成
3. `MarkdownService.ts` を作成

### Phase 3: Hooks の抽出（1時間）

1. `useTechSelection.ts` を作成
2. `useMarkdownGenerator.ts` を作成
3. `useTechIcon.ts` を作成

### Phase 4: UIコンポーネントの移行（2時間）

1. 既存コンポーネントを `features/tech-stack-generator/ui/` に移動
2. Service層・Hooksを利用するようリファクタリング
3. Public API (`index.ts`) を作成

### Phase 5: 共有コードの整理（1時間）

1. shadcn/ui を `shared/ui/primitives/` に
2. カスタムコンポーネントを `shared/ui/components/` に
3. ユーティリティを `shared/lib/` に

### Phase 6: app/ の更新（30分）

1. `app/page.tsx` を Public API 経由に変更
2. import パスを更新

**合計所要時間: 約6時間**

---

## メリット

### 1. 高凝集
- ✅ 1つの機能に関するコードが1箇所に集約
- ✅ 変更影響範囲が明確

### 2. 疎結合
- ✅ Public API により内部実装を隠蔽
- ✅ features 間の依存なし

### 3. テスタビリティ
- ✅ Service層を独立してテスト可能
- ✅ Hooks を独立してテスト可能
- ✅ UIコンポーネントをモックでテスト可能

### 4. スケーラビリティ
- ✅ 新機能は新しい feature/ として追加
- ✅ 既存機能に影響なし

### 5. 理解しやすさ
- ✅ Vertical Slice により機能全体を把握しやすい
- ✅ FSD の標準的な構造で学習コスト低

---

## ベストプラクティス

### 1. Public API の厳格化

```typescript
// ✅ GOOD - Public API経由
import { TechStackGenerator, useTechSelection } from '@/features/tech-stack-generator';

// ❌ BAD - 内部実装に直接アクセス
import { TechStackService } from '@/features/tech-stack-generator/model/services/TechStackService';
```

### 2. ディレクトリごとに index.ts

```typescript
// features/tech-stack-generator/ui/TechSelector/index.ts
export { TechSelector } from './TechSelector';
export { TechToggleButton } from './TechToggleButton';
```

### 3. 型定義の一元管理

```typescript
// features/tech-stack-generator/types/index.ts
// すべての型をここにエクスポート
```

### 4. Barrel Export の活用

```typescript
// features/tech-stack-generator/model/hooks/index.ts
export { useTechSelection } from './useTechSelection';
export { useMarkdownGenerator } from './useMarkdownGenerator';
export { useTechIcon } from './useTechIcon';
```

---

## 次のステップ

1. **Phase 1実装**: Service層のPOCを作成（TechStackService）
2. **段階的移行**: 1コンポーネントずつリファクタリング
3. **ドキュメント**: アーキテクチャガイドライン作成
4. **テスト**: Service層・Hooksの単体テスト

---

**作成日**: 2025-12-31
**ステータス**: 設計完了・実装準備完了
**推奨度**: ⭐⭐⭐⭐⭐ 最優先で実装推奨
