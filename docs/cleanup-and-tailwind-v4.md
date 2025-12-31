# クリーンアップとTailwind CSS v4移行について

## 実施済み: ディレクトリクリーンアップ

### shadcn UIコンポーネントの移行

shadcn/uiのコンポーネントをFSD構造の`shared`層に移動しました。

#### Before
```
src/
├── components/ui/          # shadcn UI コンポーネント
├── lib/utils.ts           # ユーティリティ関数
└── hooks/use-toast.ts     # カスタムフック
```

#### After
```
src/
└── shared/                 # FSD Shared Layer
    ├── ui/                # shadcn UI コンポーネント
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── tabs.tsx
    │   └── ... (18 components)
    ├── lib/
    │   └── utils.ts       # ユーティリティ関数
    └── hooks/
        └── use-toast.ts   # カスタムフック
```

### インポートパスの更新

全ファイルのインポートを新しいパスに自動更新:

```typescript
// Before
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// After
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "@/shared/hooks/use-toast";
```

### 削除済みディレクトリ

- `src/components/ui/` - shared/ui/に移動
- `src/lib/` - shared/lib/に移動
- `src/hooks/` - shared/hooks/に移動
- `src/constants/` - entities/tech/model/に移動 (backup済み)
- `src/types/` - entities/tech/model/に移動 (backup済み)
- 空ディレクトリ (primitives, components, config等)

## Tailwind CSS v4への移行について

### 現状

- **現在のバージョン**: Tailwind CSS v3.4.1
- **設定ファイル**: `tailwind.config.ts` (JavaScript形式)
- **PostCSS**: `postcss.config.mjs`

### Tailwind CSS v4の主な変更点

#### 1. CSS-First Configuration 🎨

JavaScriptの設定ファイルが**不要**になり、CSSで直接設定します。

**v3 (現在)**:
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
      }
    }
  }
}
```

**v4 (新方式)**:
```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-primary: hsl(49, 100%, 7%);
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
}
```

#### 2. Content Auto-Detection

`content` 設定が**不要**に。自動的にテンプレートファイルをスキャンします。

#### 3. @tailwind ディレクティブの廃止

```css
/* Before (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After (v4) */
@import "tailwindcss";
```

#### 4. PostCSS プラグインの分離

```javascript
// Before (v3)
plugins: [require('tailwindcss')]

// After (v4)
plugins: [require('@tailwindcss/postcss')]
```

### 移行手順

Tailwindは自動移行ツールを提供しています:

```bash
# 1. 自動移行ツールを実行
npx @tailwindcss/upgrade@next

# 2. パッケージを更新
npm install tailwindcss@next @tailwindcss/postcss@next

# 3. 設定ファイルの移行
# - tailwind.config.ts を削除
# - CSSファイルに @theme を追加
```

### ブラウザ要件

- Safari 16.4+
- Chrome 111+
- Firefox 128+

### Breaking Changes

1. **CSS プリプロセッサ非対応**: Sass/Less/Stylusとの併用不可
2. **一部ユーティリティクラスの変更**: 移行ツールが自動修正
3. **プラグインAPI変更**: カスタムプラグインは書き換えが必要

### 移行のメリット

✅ **シンプル**: JavaScript設定ファイル不要
✅ **高速**: v3より最大10倍高速なビルド
✅ **型安全**: CSS変数による型安全な設定
✅ **DX向上**: HMRの大幅な改善

### 移行のデメリット

⚠️ **Breaking Changes**: 既存コードの修正が必要
⚠️ **プラグイン互換性**: 一部のプラグインが未対応
⚠️ **学習コスト**: 新しい設定方法の習得

## 推奨アクション

### Option 1: 今すぐ移行 (推奨)

Tailwind CSS v4は安定版がリリースされており、移行ツールも提供されています。

```bash
# 移行実行
npx @tailwindcss/upgrade@next

# テスト
npm run build
npm run dev
```

### Option 2: v3のまま継続

現在の設定で問題なく動作しているため、急いで移行する必要はありません。
v4の安定性を見極めてから移行するのも選択肢です。

## 参考資料

- [Upgrade guide - Tailwind CSS](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4.0 Migration Guide - Medium](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)
- [A First Look at Setting Up Tailwind CSS v4.0](https://bryananthonio.com/blog/configuring-tailwind-css-v4/)
- [Tailwind v4 Explained - Medium](https://medium.com/@komirishettysaiteja/tailwind-v4-explained-new-features-differences-and-migration-tips-00ea7cade03c)
- [Tailwind CSS v4.0 Official Blog](https://tailwindcss.com/blog/tailwindcss-v4)

## 現在のプロジェクト状態

✅ FSD アーキテクチャ移行完了
✅ shadcn UI を shared/ に整理
✅ 不要ディレクトリの削除完了
✅ ビルド成功確認済み
🔄 Tailwind CSS v4 移行は検討中

次のステップは、Tailwind CSS v4への移行を実施するか判断してください。
