# コーディング規約

## TypeScript

### 型定義
- **Zodを使用**: データバリデーションと型定義
- **型推論を活用**: `z.infer<typeof Schema>`
- **明示的な型注釈**: 関数の引数と戻り値には型を明示

```typescript
// ✅ Good
const TechItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type TechItem = z.infer<typeof TechItemSchema>;

export function getTech(id: string): TechItem | undefined {
  return TECH_STACK[id];
}

// ❌ Bad
export function getTech(id) {
  return TECH_STACK[id];
}
```

### Enum
- **TypeScript Enum使用**: 定数グループにはenumを使用
- **string値**: 実行時の値を明確にするため

```typescript
// ✅ Good
export enum TechCategory {
  Language = "language",
  Framework = "framework",
  Library = "library",
}

// ❌ Bad
const TechCategory = {
  LANGUAGE: "language",
  FRAMEWORK: "framework",
} as const;
```

### Branded Types (型安全性の強化)

- **Zodスキーマベース**: プリミティブ型を区別するためにZodスキーマを使用
- **実行時バリデーション**: スキーマで検証しながら型安全性を確保
- **混同防止**: 異なる種類のIDやURLを型レベルで区別

```typescript
// ✅ Good - Zodでブランド型を定義
const TechIdSchema = z.string().min(1);
export type TechId = z.infer<typeof TechIdSchema>;

const IconifyIdSchema = z
  .string()
  .regex(/^(logos|simple-icons|devicon):[a-z0-9-]+$/, {
    message: "Iconify ID must be in format 'prefix:icon-name'",
  });
export type IconifyId = z.infer<typeof IconifyIdSchema>;

const TechLinkSchema = z.string().url();
export type TechLink = z.infer<typeof TechLinkSchema>;

// バリデーション関数で型の変換を行う
export const validateTechId = (id: string): TechId =>
  TechIdSchema.parse(id);

export const validateIconifyId = (id: string): IconifyId =>
  IconifyIdSchema.parse(id);

// 使用例 - 型の混同を防ぐ
function getTech(id: TechId): TechItem | undefined {
  return TECH_STACK[id];
}

function fetchIcon(iconId: IconifyId): Promise<string> {
  return IconifyService.fetchSvg(iconId);
}

// ❌ 型エラー - TechIdとIconifyIdは別の型
const techId: TechId = validateTechId("react");
const iconId: IconifyId = validateIconifyId("logos:react");
getTech(iconId); // Type error!
fetchIcon(techId); // Type error!

// ✅ 正しい使い方
getTech(techId);
fetchIcon(iconId);
```

#### Branded Typesのメリット

1. **型の混同を防ぐ**: stringの派生型同士を区別

   ```typescript
   // すべてstringだが、TypeScriptが区別してくれる
   type TechId = string;      // NG: ただのstring
   type TechId = z.infer<...>; // OK: Zodスキーマから派生した独自の型
   ```

2. **実行時バリデーション**: Zodスキーマで形式チェック

   ```typescript
   // 不正な形式は実行時に検出される
   validateIconifyId("invalid"); // ZodError: 形式が不正
   validateIconifyId("logos:react"); // OK
   ```

3. **ドキュメント効果**: 型名で意図が明確

   ```typescript
   // Before
   function fetchIcon(id: string) // どんなstring?

   // After
   function fetchIcon(id: IconifyId) // Iconify形式のIDとわかる
   ```

4. **リファクタリング安全性**: 型変更が全体に波及

   ```typescript
   // IconifyIdの形式を変更したら、使用箇所すべてで型エラー
   // 変更漏れを防げる
   ```

#### 使用ガイドライン

- **ID型**: エンティティのIDは専用の型を定義
- **URL型**: 外部リンクは`TechLink`のようにブランド化
- **フォーマット制約**: regex検証が必要な文字列はブランド型に
- **バリデーション関数**: 型変換には必ず検証関数を用意

```typescript
// パターン: Schema → Type → Validator
const MyIdSchema = z.string().min(1);
export type MyId = z.infer<typeof MyIdSchema>;
export const validateMyId = (id: string): MyId => MyIdSchema.parse(id);
```

## React

### コンポーネント定義
- **関数コンポーネント**: アロー関数ではなく関数宣言
- **default export**: コンポーネントは基本的にdefault export
- **型定義**: Propsは明示的に定義

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Bad
export const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

### Hooks
- **Custom Hooks**: `use`プレフィックス
- **依存配列**: 必ず明示的に指定
- **useCallback/useMemo**: 最適化が必要な場合のみ使用

```typescript
// ✅ Good
export function useTechSelection(initialItems: TechItem[] = []) {
  const [selected, setSelected] = useState<TechItem[]>(initialItems);

  const toggle = useCallback((tech: TechItem) => {
    setSelected((prev) => /* ... */);
  }, []); // 依存配列を明示

  return { selected, toggle };
}
```

### Client Components
- **"use client"**: クライアント専用機能を使う場合のみ
- **配置**: ファイルの最上部

```typescript
// ✅ Good
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## インポート順序

```typescript
// 1. React関連
import { useState, useCallback } from "react";
import type { FC } from "react";

// 2. 外部ライブラリ
import { z } from "zod";
import { clsx } from "clsx";

// 3. Entities
import { TechStackService, type TechItem } from "@/entities/tech";

// 4. Features
import { useTechSelection } from "@/features/tech-selection";

// 5. Shared
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

// 6. 相対パス（同一ディレクトリ）
import { LocalComponent } from "./LocalComponent";
```

## ネーミング規約

### ファイル名
- **コンポーネント**: PascalCase (`Button.tsx`)
- **Hooks**: camelCase (`useTechSelection.ts`)
- **Services**: PascalCase (`TechStackService.ts`)
- **ユーティリティ**: camelCase (`utils.ts`)
- **型定義**: camelCase (`types.ts`)

### 変数・関数
- **変数**: camelCase
- **定数**: UPPER_SNAKE_CASE
- **型・インターフェース**: PascalCase
- **コンポーネント**: PascalCase
- **関数**: camelCase

```typescript
// ✅ Good
const TECH_STACK_LIST = [...];
const techItems = getTechItems();
type TechItem = { ... };
interface TechStackService { ... }
function getTechById(id: string) { ... }
```

## コメント

### JSDoc
- **Public API**: 必須
- **複雑なロジック**: 推奨
- **明白な処理**: 不要

```typescript
/**
 * Tech Stack管理サービス
 *
 * データアクセス・検索・フィルタリングロジックを提供
 */
export class TechStackService {
  /**
   * IDからTech情報を取得
   *
   * @param id - Tech ID
   * @returns Tech情報、存在しない場合はundefined
   */
  static getById(id: TechId): TechItem | undefined {
    return TECH_STACK[id];
  }
}
```

### インラインコメント
- **最小限**: コードで説明できる場合はコメント不要
- **Why > What**: 「なぜ」を説明、「何を」は避ける

```typescript
// ✅ Good
// Safari 16.4未満ではこのAPIがサポートされていないため、ポリフィルを使用
if (!navigator.clipboard) {
  useFallbackCopy();
}

// ❌ Bad
// clipboardがない場合にfallbackを使う
if (!navigator.clipboard) {
  useFallbackCopy();
}
```

## エラーハンドリング

### try-catch
- **非同期処理**: 必ずtry-catchで囲む
- **エラーメッセージ**: ユーザーフレンドリーに

```typescript
// ✅ Good
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
} catch (error) {
  console.error('Failed to fetch data:', error);
  return null;
}
```

### Optional Chaining
- **nullableな値**: `?.`を使用
- **Nullish Coalescing**: `??`でデフォルト値

```typescript
// ✅ Good
const name = tech?.name ?? 'Unknown';
const url = tech?.link ?? `https://default.com`;
```

## パフォーマンス

### 最適化の原則
1. **測定してから最適化**: 不要な最適化は避ける
2. **useCallback/useMemo**: 必要な場合のみ
3. **Dynamic Import**: 大きなライブラリは遅延読み込み

```typescript
// ✅ Good - 重い計算のメモ化
const expensiveValue = useMemo(() => {
  return items.filter(/* complex logic */);
}, [items]);

// ❌ Bad - 不要なメモ化
const simpleValue = useMemo(() => item.name, [item]);
```

## セキュリティ

### XSS対策
- **dangerouslySetInnerHTML**: 最小限の使用
- **ユーザー入力**: 必ずサニタイズ

### 型安全
- **any禁止**: 原則使用しない
- **unknown**: anyの代わりに使用

```typescript
// ✅ Good
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// ❌ Bad
function handleError(error: any) {
  console.error(error.message);
}
```

## フォーマット

- **Prettier**: 自動フォーマット使用
- **ESLint**: ルール遵守
- **改行**: 関数間は1行空ける
- **インデント**: 2スペース

## 参考
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
