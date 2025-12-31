# アーキテクチャ改善提案：高凝集・疎結合な設計

## 現状分析

### 現在のディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── fonts/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── generator/         # ジェネレーター機能
│   │   ├── GeneratorContainer.tsx
│   │   ├── IconGridGenerator.tsx
│   │   └── TechIconGrid.tsx
│   ├── layout/            # レイアウト
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── theme/             # テーマ
│   │   ├── ThemeProvider.tsx
│   │   └── ModeToggle.tsx
│   ├── ui/                # shadcn/ui コンポーネント
│   └── utils/             # ユーティリティコンポーネント
│       ├── Combobox.tsx
│       ├── DndList.tsx
│       └── TooltipIconButton.tsx
├── constants/             # 定数
│   └── techStack.ts
├── hooks/                 # カスタムフック
│   └── use-toast.ts
├── lib/                   # ユーティリティ関数
│   └── utils.ts
└── types/                 # 型定義
    └── tech.ts
```

### 問題点

#### 1. **機能ごとの凝集性が低い**
- `components/generator/` にビジネスロジックが混在
- データ（`constants/`）と型（`types/`）が分離
- バリデーション関数が `types/tech.ts` に存在

#### 2. **依存関係が明確でない**
- コンポーネントが直接 `constants/techStack` を参照
- ドメインロジック（tech stack管理）が散在

#### 3. **スケーラビリティの課題**
- 新機能追加時にどこに配置すべきか不明確
- テストしづらい構造

---

## 改善提案：Feature-Based Architecture

### 提案する新構造

```
src/
├── app/                          # Next.js App Router（変更なし）
│   ├── fonts/
│   ├── layout.tsx
│   └── page.tsx
│
├── features/                     # ★ 機能ごとのモジュール
│   └── tech-stack/              # Tech Stack管理機能
│       ├── components/          # 機能固有コンポーネント
│       │   ├── TechIconGrid.tsx
│       │   ├── TechSelector.tsx
│       │   └── MarkdownGenerator.tsx
│       ├── hooks/               # 機能固有フック
│       │   ├── useTechSelection.ts
│       │   └── useMarkdownGenerator.ts
│       ├── services/            # ビジネスロジック
│       │   ├── techStackService.ts
│       │   └── iconifyService.ts
│       ├── types/               # 機能固有型定義
│       │   └── index.ts
│       ├── constants/           # 機能固有定数
│       │   └── techStackData.ts
│       ├── utils/               # 機能固有ユーティリティ
│       │   └── validators.ts
│       └── index.ts             # Public API
│
├── shared/                       # ★ 共有モジュール
│   ├── components/              # 共有UIコンポーネント
│   │   ├── ui/                  # shadcn/ui
│   │   ├── layout/              # Header, Footer
│   │   └── common/              # 汎用コンポーネント
│   │       ├── Combobox.tsx
│   │       ├── DndList.tsx
│   │       └── TooltipIconButton.tsx
│   ├── hooks/                   # 共有フック
│   │   ├── use-toast.ts
│   │   └── use-theme.ts
│   ├── lib/                     # 共有ユーティリティ
│   │   └── utils.ts
│   └── types/                   # 共有型定義
│       └── common.ts
│
└── core/                         # ★ コア機能
    ├── config/                  # アプリ設定
    │   └── app.config.ts
    └── providers/               # グローバルプロバイダー
        └── ThemeProvider.tsx
```

---

## 設計原則

### 1. **Feature-Based Organization（機能ベース）**

各機能は自己完結的なモジュールとして配置：

```typescript
// features/tech-stack/index.ts
// Public API（外部から使用する機能のみエクスポート）
export { TechSelector } from './components/TechSelector';
export { useTechSelection } from './hooks/useTechSelection';
export { TECH_STACK, TECH_STACK_LIST } from './constants/techStackData';
export type { TechItem, TechCategory } from './types';
```

**メリット:**
- 機能の追加・削除が容易
- 依存関係が明確
- テストが書きやすい

### 2. **高凝集（High Cohesion）**

関連するコードを1つのモジュールにまとめる：

```
features/tech-stack/
├── components/      # UI
├── hooks/           # ロジック
├── services/        # データアクセス・API
├── types/           # 型定義
├── constants/       # データ
└── utils/           # ヘルパー関数
```

### 3. **疎結合（Loose Coupling）**

機能間は Public API を通じてのみ通信：

```typescript
// ❌ 直接参照（疎結合でない）
import { TECH_STACK } from '@/constants/techStack';

// ✅ Public API経由（疎結合）
import { TECH_STACK } from '@/features/tech-stack';
```

### 4. **依存関係の方向性**

```
app/ → features/ → shared/ → core/
```

- `app/`: ページ・ルーティング
- `features/`: ビジネスロジック
- `shared/`: 共有コンポーネント
- `core/`: 基盤機能

---

## 移行例：Tech Stack機能

### Before

```typescript
// src/components/generator/TechIconGrid.tsx
import { TECH_STACK } from "@/constants/techStack";

export default function TechIconGrid({ iconIds }: Props) {
  // ロジックとUIが混在
  const tech = TECH_STACK[iconId];
  const iconUrl = `https://api.iconify.design/${tech?.iconify}.svg`;
  return <img src={iconUrl} />;
}
```

### After

```typescript
// features/tech-stack/services/iconifyService.ts
export class IconifyService {
  static getIconUrl(iconifyId: string, size: number = 48): string {
    return `https://api.iconify.design/${iconifyId}.svg?width=${size}&height=${size}`;
  }
}

// features/tech-stack/hooks/useTechIcon.ts
export function useTechIcon(techId: string) {
  const tech = TECH_STACK[techId];
  const iconUrl = IconifyService.getIconUrl(tech?.iconify || `logos:${techId}`);
  return { tech, iconUrl };
}

// features/tech-stack/components/TechIconGrid.tsx
export function TechIconGrid({ iconIds }: Props) {
  return (
    <div>
      {iconIds.map((id) => (
        <TechIcon key={id} techId={id} />
      ))}
    </div>
  );
}

function TechIcon({ techId }: { techId: string }) {
  const { tech, iconUrl } = useTechIcon(techId);
  return <img src={iconUrl} alt={tech?.name} />;
}
```

**改善点:**
- ✅ ビジネスロジック（Service）が分離
- ✅ カスタムフックで再利用可能
- ✅ コンポーネントはUIのみに集中
- ✅ テストが容易

---

## 実装例：新しいService層

### features/tech-stack/services/techStackService.ts

```typescript
import { TECH_STACK, TECH_STACK_LIST } from '../constants/techStackData';
import type { TechItem, TechCategory, TechId } from '../types';

/**
 * Tech Stack管理サービス
 * データアクセス・検索・フィルタリングロジックを集約
 */
export class TechStackService {
  /**
   * IDからTech情報を取得
   */
  static getById(id: TechId): TechItem | undefined {
    return TECH_STACK[id as keyof typeof TECH_STACK];
  }

  /**
   * カテゴリでフィルタリング
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
   * 全Tech一覧
   */
  static getAll(): TechItem[] {
    return TECH_STACK_LIST;
  }
}
```

### features/tech-stack/services/iconifyService.ts

```typescript
import type { IconifyId } from '../types';

/**
 * Iconify API連携サービス
 */
export class IconifyService {
  private static readonly BASE_URL = 'https://api.iconify.design';

  /**
   * アイコンURLを生成
   */
  static getIconUrl(iconifyId: IconifyId, size: number = 48): string {
    return `${this.BASE_URL}/${iconifyId}.svg?width=${size}&height=${size}`;
  }

  /**
   * アイコンの存在確認（バリデーション用）
   */
  static async validateIcon(iconifyId: IconifyId): Promise<boolean> {
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

### features/tech-stack/hooks/useTechSelection.ts

```typescript
import { useState, useCallback } from 'react';
import { TechStackService } from '../services/techStackService';
import type { TechItem } from '../types';

/**
 * Tech選択管理フック
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

  return {
    selected,
    toggle,
    selectAll,
    clear,
    isSelected,
  };
}
```

---

## 移行戦略

### Phase 1: Service層の導入（1-2時間）

1. `features/tech-stack/services/` を作成
2. `TechStackService` と `IconifyService` を実装
3. 既存コンポーネントを Service 経由に変更

### Phase 2: Hooks の抽出（1-2時間）

1. `features/tech-stack/hooks/` を作成
2. ビジネスロジックをカスタムフックに抽出
3. コンポーネントを簡素化

### Phase 3: ディレクトリ再編成（2-3時間）

1. `features/` 構造を作成
2. ファイルを段階的に移動
3. import パスを更新

### Phase 4: 共有モジュールの整理（1時間）

1. `shared/` にコンポーネントを移動
2. Public API を定義

---

## メリット

### 開発効率

- ✅ 機能追加が高速（関連コードが1箇所に集約）
- ✅ デバッグが容易（依存関係が明確）
- ✅ コードレビューが効率的（変更範囲が限定的）

### 保守性

- ✅ リファクタリングが安全（影響範囲が明確）
- ✅ 新メンバーのオンボーディングが容易
- ✅ ドキュメントが書きやすい

### テスタビリティ

- ✅ 単体テストが書きやすい（Service・Hooks）
- ✅ モックが容易（依存性注入可能）
- ✅ 統合テストが明確

### スケーラビリティ

- ✅ 新機能の追加が容易
- ✅ 機能の分離・統合が簡単
- ✅ マイクロフロントエンド対応可能

---

## 比較表

| 観点 | 現状 | 改善後 |
|------|------|--------|
| **凝集性** | 低（データ・型・ロジックが分散） | 高（機能単位で集約） |
| **結合度** | 高（直接参照が多い） | 低（Public API経由） |
| **テスト** | 難（依存関係が複雑） | 易（Service単位でテスト） |
| **拡張性** | 低（ファイル配置が不明確） | 高（機能追加パターンが明確） |
| **理解しやすさ** | 中（構造が平坦） | 高（機能が明確） |

---

## 次のステップ

1. **POC実装**: まず `TechStackService` を作成して効果を検証
2. **段階的移行**: 既存コンポーネントを1つずつリファクタリング
3. **ドキュメント整備**: アーキテクチャガイドラインを作成
4. **CI/CD統合**: 構造を活かしたテスト戦略を策定

---

## 参考資料

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Domain-Driven Design for Frontend](https://khalilstemmler.com/articles/client-side-architecture/introduction/)
- [React Architecture Best Practices](https://www.patterns.dev/posts/presentational-container-pattern)

---

**作成日**: 2025-12-31
**ステータス**: 提案中
**推奨度**: ⭐⭐⭐⭐⭐ 高優先度
