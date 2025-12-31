# アイコン定数リファクタリング計画

## 現状分析

### 現在のファイル構成
- `src/constants/techStack.ts`: TechItemの配列定義 (227項目)
- `src/lib/iconMapping.ts`: ID → Iconify ID のマッピング (273項目)
- `src/lib/techLinks.ts`: ID → URL のマッピング (212項目)
- `src/types/tech.ts`: 型定義

### 発見された問題点

#### 1. データの重複と不整合リスク
```
現在の状況:
- iconMapping: 273項目
- techStack: 227項目
- techLinks: 212項目

問題:
- 同じIDが複数ファイルに散在
- 追加/削除時に3箇所の同期が必要
- 数が一致しておらず、既に不整合の可能性
```

#### 2. 型安全性の欠如
```typescript
// 現在の実装
export const iconMapping: Record<string, string> = {
  react: "logos:react",
  // ...
};

export function getIconifyIcon(skillIconId: string): string {
  return iconMapping[skillIconId.toLowerCase()] || `logos:${skillIconId}`;
}
```

**問題点:**
- `string`型のため、存在しないIDでもコンパイルエラーにならない
- IDの typo を検出できない
- IDの補完が効かない
- フォールバック処理が不透明

#### 3. データアクセスパターンの分散
```typescript
// 使用箇所での典型的なパターン
const iconifyId = getIconifyIcon(tech.id);
const link = getTechLink(tech.id, tech.name);
```

**問題点:**
- `TechItem`にアイコン情報が含まれていない
- 常に別途関数呼び出しが必要
- tech.idとtech.nameの両方を渡す冗長性

#### 4. データの不完全性
```
iconMapping: 273項目 → すべてのアイコンマッピングが定義されている
techLinks: 212項目 → 約60項目のリンクが未定義
techStack: 227項目 → 基準となるデータセット
```

**問題点:**
- techLinksに存在しない項目が多数
- フォールバック処理に依存
- どの項目にリンクがあるか不明確

#### 5. カテゴリ分類の曖昧さ
```typescript
{ id: "jest", name: "Jest", category: TechCategory.Other }  // テストツールだが Other
{ id: "kafka", name: "Apache Kafka", category: TechCategory.Other }  // メッセージキューだが Other
{ id: "ai", name: "Artificial Intelligence (AI)", category: TechCategory.Other }  // 曖昧な定義
```

#### 6. 命名の一貫性欠如
```typescript
// 略称と正式名称の混在
id: "ae" → name: "Adobe After Effects"
id: "au" → name: "AU (Audio Units)"
id: "ai" → name: "Artificial Intelligence (AI)"
id: "ps" → name: "Adobe PhotoShop"

// 同じAdobe製品でも命名規則が異なる
ae, au, ai, ps (略称) vs adonis (フルネーム)
```

## 改善目標

### 1. Single Source of Truth
- すべてのアイコン関連情報を1箇所に集約
- データの重複を排除
- 追加時は1箇所のみ編集

### 2. 完全な型安全性
- Tech IDを string literal union type で定義
- 存在しないIDの使用をコンパイル時に検出
- IDの自動補完を実現
- フォールバック処理を明示的に

### 3. 保守性の向上
- 新規追加時の手順を簡素化
- データ構造を自己文書化
- バリデーションを自動化

### 4. パフォーマンスの最適化
- 不要な関数呼び出しの削減
- データアクセスの高速化

## 設計案

### Option A: TechItemの拡張 (推奨)

```typescript
// types/tech.ts
export const TECH_IDS = [
  "react",
  "vue",
  "angular",
  // ...
] as const;

export type TechId = typeof TECH_IDS[number];

export interface TechItem {
  id: TechId;
  name: string;
  category: TechCategory;
  iconify: string;  // NEW: Iconify ID
  link?: string;     // NEW: Optional link
}

// constants/techStack.ts
export const TECH_STACK: Record<TechId, TechItem> = {
  react: {
    id: "react",
    name: "React",
    category: TechCategory.Framework,
    iconify: "logos:react",
    link: "https://react.dev/",
  },
  // ...
};

// 配列形式も提供
export const TECH_STACK_LIST: TechItem[] = Object.values(TECH_STACK);
```

**メリット:**
- ✅ すべての情報が1箇所に集約
- ✅ 完全な型安全性
- ✅ IDの自動補完が効く
- ✅ Record型により高速なルックアップ
- ✅ 既存のコンポーネントへの影響が最小限

**デメリット:**
- ❌ ファイルサイズが若干大きくなる
- ❌ 既存の3ファイルを統合する移行作業が必要

### Option B: 型定義ファイルの分離

```typescript
// types/techIds.ts (自動生成)
export type TechId =
  | "react"
  | "vue"
  | "angular"
  // ...

// constants/techData.ts
const techData = {
  react: {
    name: "React",
    category: TechCategory.Framework,
    iconify: "logos:react",
    link: "https://react.dev/",
  },
  // ...
} as const satisfies Record<TechId, TechMetadata>;
```

**メリット:**
- ✅ 型定義とデータの分離
- ✅ より厳密な型チェック

**デメリット:**
- ❌ ファイル構成が複雑化
- ❌ 型生成の自動化が必要

## 移行計画

### Phase 1: 新構造の準備
1. ✅ 課題の洗い出し (このドキュメント)
2. 新しいデータ構造の作成
3. 既存データの統合・検証

### Phase 2: 段階的な移行
1. 新しい`TechItem`型の定義
2. `TECH_STACK`オブジェクトの作成
3. ヘルパー関数の更新
4. コンポーネントの移行

### Phase 3: クリーンアップ
1. 古いファイルの削除
   - `src/lib/iconMapping.ts`
   - `src/lib/techLinks.ts`
2. 未使用コードの削除
3. ドキュメントの更新

### Phase 4: バリデーション
1. 型エラーの確認
2. ビルドの確認
3. 動作テスト

## データ品質の改善項目

### 1. カテゴリの見直し
```typescript
// 新しいカテゴリの提案
export enum TechCategory {
  Language = "language",
  Framework = "framework",
  Library = "library",
  Platform = "platform",
  Cloud = "cloud",
  Database = "database",
  CICD = "cicd",
  BuildTool = "buildtool",
  Testing = "testing",        // NEW: Jest, Cypress等
  MessageQueue = "messagequeue", // NEW: Kafka, RabbitMQ等
  Monitoring = "monitoring",   // NEW: Grafana, Prometheus等
  Editor = "editor",           // NEW: VSCode, Vim等
  Design = "design",           // NEW: Figma, Adobe製品等
  Other = "other",
}
```

### 2. リンク情報の補完
- 現在212/227項目にリンクあり
- 残り15項目のリンクを調査・追加
- または意図的に`link: undefined`を明示

### 3. Iconifyアイコンの検証
- すべてのアイコンIDが有効か確認
- 代替アイコンの検討
- アイコンプロバイダの統一 (logos, simple-icons, devicon)

## リスク分析

### 高リスク
- 既存のコンポーネントが壊れる可能性
  - **対策**: 段階的な移行、十分なテスト

### 中リスク
- データ移行時の情報損失
  - **対策**: 既存データの完全なバックアップ、バリデーション

### 低リスク
- パフォーマンスへの影響
  - **対策**: Record型を使用したO(1)アクセス

## 成功指標

1. ✅ すべてのアイコン関連情報が1ファイルに集約
2. ✅ TypeScriptの型エラーゼロ
3. ✅ コンパイルエラーなし
4. ✅ 既存の全機能が動作
5. ✅ IDの自動補完が動作
6. ✅ 新規技術の追加が1箇所の編集で完了

## さらなるバリューアップ提案

### 提案1: Zod v4 Schema + Branded Types によるランタイムバリデーション

現在、Zod v4がdependenciesに含まれていますが、tech dataのバリデーションには使われていません。
Zod v4の **branded types** を活用することで、型レベルでの識別性を保証し、誤った値の代入を防ぎます。

```typescript
// types/tech.ts
import { z } from 'zod';

// Branded Types で型の識別性を保証
const TechIdSchema = z.string().brand<'TechId'>();
export type TechId = z.infer<typeof TechIdSchema>;

const IconifyIdSchema = z
  .string()
  .regex(/^(logos|simple-icons|devicon):[a-z0-9-]+$/, {
    message: "Iconify ID must be in format 'prefix:icon-name'",
  })
  .brand<'IconifyId'>();
export type IconifyId = z.infer<typeof IconifyIdSchema>;

const TechLinkSchema = z.string().url().brand<'TechLink'>();
export type TechLink = z.infer<typeof TechLinkSchema>;

// メインのスキーマ定義
export const TechItemSchema = z.object({
  id: TechIdSchema,
  name: z.string().min(1),
  category: z.nativeEnum(TechCategory),
  iconify: IconifyIdSchema,
  link: TechLinkSchema.optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type TechItem = z.infer<typeof TechItemSchema>;

// ヘルパー関数でBranded Typeを作成
export const createTechId = (id: string): TechId =>
  TechIdSchema.parse(id);

export const createIconifyId = (id: string): IconifyId =>
  IconifyIdSchema.parse(id);

export const createTechLink = (url: string): TechLink =>
  TechLinkSchema.parse(url);

// constants/techStack.ts
// ビルド時にバリデーション
TECH_STACK_LIST.forEach(item => {
  const result = TechItemSchema.safeParse(item);
  if (!result.success) {
    throw new Error(`Invalid tech item: ${item.id}\n${result.error}`);
  }
});

// 使用例: Branded Typeにより型安全性が向上
function getIconUrl(iconifyId: IconifyId): string {
  return `https://api.iconify.design/${iconifyId}.svg`;
}

// これはOK
const validIcon = createIconifyId("logos:react");
getIconUrl(validIcon);

// これはコンパイルエラー（IconifyIdではなくstring型）
const invalidIcon = "logos:react";
getIconUrl(invalidIcon); // ❌ Type Error!

// これは実行時エラー（形式が不正）
const malformedIcon = createIconifyId("invalid-format"); // ❌ Runtime Error!
```

**Branded Types のメリット:**
- ✅ **型レベルでの識別性**: `string`と`TechId`を区別し、誤った代入を防ぐ
- ✅ **誤用の防止**: `TechId`が必要な場所に普通の文字列を渡せない
- ✅ **自己文書化**: 型シグネチャを見るだけで何が必要か明確
- ✅ **リファクタリングの安全性**: 型が変わった際のコンパイルエラーで検出

**バリデーションのメリット:**
- ✅ iconify IDの形式を自動検証（typoを防ぐ）
- ✅ URLの形式を自動検証
- ✅ ビルド時にデータの整合性を保証
- ✅ ランタイムエラーを未然に防ぐ

**実用例:**
```typescript
// lib/iconUtils.ts
export function buildIconUrl(iconifyId: IconifyId, size: number = 48): string {
  // iconifyIdがIconifyId型なので、形式が保証されている
  return `https://api.iconify.design/${iconifyId}.svg?width=${size}&height=${size}`;
}

// components/TechIcon.tsx
interface TechIconProps {
  techId: TechId;  // TechId型を要求
  size?: number;
}

export function TechIcon({ techId, size }: TechIconProps) {
  const tech = TECH_STACK[techId];  // 型安全なアクセス
  const iconUrl = buildIconUrl(tech.iconify, size);
  return <img src={iconUrl} alt={tech.name} />;
}

// 使用時
<TechIcon techId={createTechId("react")} />  // ✅ OK
<TechIcon techId="react" />  // ❌ Type Error!
```

### 提案2: Iconify アイコンの存在チェック機構

**方針:** 基本的にIconifyを使用。IconifyはLogos, Simple Icons, Devicon等の複数のアイコンセットを統一されたAPIで提供。

```typescript
// scripts/validate-icons.ts
import { TECH_STACK_LIST } from '../src/constants/techStack';

/**
 * Iconify APIでアイコンの存在を確認
 *
 * Iconifyは複数のアイコンセット（logos, simple-icons, devicon等）を
 * 統一されたAPIで提供している。
 */
async function validateIconifyIcon(iconifyId: string): Promise<boolean> {
  const [prefix, iconName] = iconifyId.split(':');

  if (!prefix || !iconName) {
    console.error(`Invalid format: ${iconifyId}`);
    return false;
  }

  try {
    // Iconify APIで統一的に存在確認
    const response = await fetch(
      `https://api.iconify.design/${iconifyId}.svg`,
      { method: 'HEAD' }
    );
    return response.ok;
  } catch (error) {
    console.error(`Error checking ${iconifyId}:`, error);
    return false;
  }
}

// npm scriptsで実行: "validate:icons": "tsx scripts/validate-icons.ts"
async function validateAllIcons() {
  console.log('🔍 Validating all icons via Iconify API...\n');

  const results = await Promise.all(
    TECH_STACK_LIST.map(async (tech) => {
      const isValid = await validateIconifyIcon(tech.iconify);
      return { tech, isValid };
    })
  );

  const invalid = results.filter(r => !r.isValid);

  if (invalid.length > 0) {
    console.error(`❌ Found ${invalid.length} invalid icons`);
    invalid.forEach(({ tech }) => {
      console.error(`  - ${tech.id}: ${tech.iconify}`);
    });
    console.error('\n💡 Check: https://icon-sets.iconify.design/');
    process.exit(1);
  }

  console.log(`✅ All ${TECH_STACK_LIST.length} icons are valid!`);
}

validateAllIcons();
```

**メリット:**
- ✅ 404エラーになるアイコンを事前検出
- ✅ CI/CDパイプラインに組み込み可能
- ✅ Iconifyの統一APIで一貫した検証
- ✅ アイコンプロバイダーの分布を把握可能

### 提案3: 検索性の向上（エイリアス・タグ対応）

```typescript
export interface TechItem {
  id: TechId;
  name: string;
  category: TechCategory;
  iconify: string;
  link?: string;
  aliases?: string[];  // NEW: 別名・略称
  tags?: string[];     // NEW: 検索タグ
}

// Example
{
  id: "js",
  name: "JavaScript",
  category: TechCategory.Language,
  iconify: "logos:javascript",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  aliases: ["javascript", "ecmascript", "es6", "es2015"],
  tags: ["frontend", "backend", "scripting", "web"],
}

// lib/techSearch.ts
export function searchTech(query: string): TechItem[] {
  const q = query.toLowerCase();
  return TECH_STACK_LIST.filter(tech =>
    tech.id.includes(q) ||
    tech.name.toLowerCase().includes(q) ||
    tech.aliases?.some(alias => alias.includes(q)) ||
    tech.tags?.some(tag => tag.includes(q))
  );
}
```

**メリット:**
- ✅ "js" でも "javascript" でも検索可能
- ✅ タグベースのフィルタリング
- ✅ UXの大幅な向上

### 提案4: JSON Schemaとドキュメント自動生成

```typescript
// scripts/generate-schema.ts
import { zodToJsonSchema } from 'zod-to-json-schema';

const jsonSchema = zodToJsonSchema(TechItemSchema);
fs.writeFileSync(
  'docs/tech-item-schema.json',
  JSON.stringify(jsonSchema, null, 2)
);

// scripts/generate-docs.ts
// Markdown形式のドキュメント自動生成
const markdown = `
# Tech Stack Data Schema

## Available Technologies (${TECH_STACK_LIST.length})

${Object.entries(groupByCategory(TECH_STACK_LIST))
  .map(([category, items]) => `
### ${category} (${items.length})

${items.map(item => `- **${item.name}** (\`${item.id}\`) - ${item.link || 'No link'}`).join('\n')}
  `).join('\n')}
`;

fs.writeFileSync('docs/TECH_STACK.md', markdown);
```

**メリット:**
- ✅ データスキーマの可視化
- ✅ ドキュメントの自動同期
- ✅ 外部ツールとの連携が容易

### 提案5: TypeScript の Template Literal Types 活用

```typescript
// types/iconify.ts
type IconifyPrefix = 'logos' | 'simple-icons' | 'devicon';
type IconifyIcon<P extends IconifyPrefix = IconifyPrefix> = `${P}:${string}`;

export interface TechItem {
  id: TechId;
  name: string;
  category: TechCategory;
  iconify: IconifyIcon;  // より厳密な型
  link?: string;
}

// これはコンパイルエラーになる
const invalid: TechItem = {
  id: "react",
  iconify: "invalid-format",  // ❌ Error: Type '"invalid-format"' is not assignable
  // ...
};
```

**メリット:**
- ✅ iconify IDの形式をより厳密に型チェック
- ✅ "prefix:name"形式を強制
- ✅ IDEの補完がより正確に

### 提案6: 国際化（i18n）対応の準備

```typescript
export interface TechItem {
  id: TechId;
  name: string;
  nameI18n?: {
    ja?: string;
    zh?: string;
    // ...
  };
  description?: string;
  descriptionI18n?: {
    ja?: string;
    zh?: string;
  };
  category: TechCategory;
  iconify: string;
  link?: string;
}

// Example
{
  id: "react",
  name: "React",
  nameI18n: {
    ja: "リアクト",
    zh: "反应",
  },
  description: "A JavaScript library for building user interfaces",
  descriptionI18n: {
    ja: "ユーザーインターフェース構築のためのJavaScriptライブラリ",
  },
  // ...
}
```

**メリット:**
- ✅ 多言語対応の準備
- ✅ グローバル展開に対応
- ✅ アクセシビリティ向上

### 提案7: メタデータの充実

```typescript
export interface TechItem {
  id: TechId;
  name: string;
  category: TechCategory;
  iconify: string;
  link?: string;

  // NEW: メタデータ
  metadata?: {
    firstReleaseYear?: number;      // リリース年
    popularity?: 'low' | 'medium' | 'high';  // 人気度
    learningCurve?: 'easy' | 'medium' | 'hard';  // 学習難易度
    license?: string;                // ライセンス
    maintainer?: string;             // メンテナー
    githubStars?: number;            // GitHubスター数
    deprecated?: boolean;            // 非推奨フラグ
    successorId?: TechId;            // 後継技術
  };
}

// Example
{
  id: "atom",
  name: "Atom",
  category: TechCategory.Editor,
  iconify: "logos:atom",
  metadata: {
    deprecated: true,
    successorId: "vscode",  // VSCodeが後継
  }
}
```

**メリット:**
- ✅ より豊かな情報提供
- ✅ フィルタリング・ソート機能の強化
- ✅ 非推奨技術の警告表示

### 提案8: ビルド時の最適化

```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    // Tree shaking for unused tech items
    config.optimization.usedExports = true;
    return config;
  },
};

// constants/techStack.ts
// 使用されているtechのみをバンドル
export function getTechById(id: TechId): TechItem {
  return TECH_STACK[id];
}

// 配列はon-demandで生成
export const TECH_STACK_LIST = Object.values(TECH_STACK);
```

**メリット:**
- ✅ バンドルサイズの削減
- ✅ 初期ロード時間の短縮
- ✅ パフォーマンス向上

### 提案9: CI/CDパイプラインへの組み込み

```yaml
# .github/workflows/validate-tech-data.yml
name: Validate Tech Data

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run validate:icons
      - run: npm run validate:links
      - run: npm run build
```

**メリット:**
- ✅ 無効なデータのmergeを防止
- ✅ データ品質の自動保証
- ✅ レビュー負荷の軽減

### 提案10: エディタ支援の強化

```json
// .vscode/settings.json
{
  "json.schemas": [
    {
      "fileMatch": ["src/constants/techStack.ts"],
      "schema": "./docs/tech-item-schema.json"
    }
  ]
}
```

**メリット:**
- ✅ VSCodeでリアルタイム検証
- ✅ 入力時の自動補完
- ✅ 開発体験の向上

## 優先度マトリクス

| 提案 | 価値 | 実装コスト | 優先度 |
|------|------|------------|--------|
| 1. Zod バリデーション | 高 | 低 | 🔥 最優先 |
| 2. アイコン存在チェック | 高 | 中 | 🔥 最優先 |
| 3. エイリアス・タグ | 中 | 低 | ⭐ 高 |
| 4. ドキュメント自動生成 | 中 | 低 | ⭐ 高 |
| 5. Template Literal Types | 中 | 低 | ⭐ 高 |
| 6. i18n対応 | 低 | 高 | 💡 将来 |
| 7. メタデータ充実 | 中 | 中 | 💡 将来 |
| 8. ビルド最適化 | 低 | 中 | 💡 将来 |
| 9. CI/CD組み込み | 高 | 低 | ⭐ 高 |
| 10. エディタ支援 | 中 | 低 | ⭐ 高 |

## 推奨実装順序

### Phase 1: 基盤強化（最優先）
1. Zodバリデーション導入
2. アイコン存在チェック
3. Template Literal Types適用

### Phase 2: DX向上（高優先度）
4. エイリアス・タグ対応
5. CI/CD組み込み
6. エディタ支援強化

### Phase 3: 付加価値（将来検討）
7. ドキュメント自動生成
8. メタデータ充実
9. i18n対応準備
10. ビルド最適化

## Next Steps

1. このプランのレビューと承認
2. Option A vs Option B の選択
3. カテゴリ見直しの要否確認
4. バリューアップ提案の取捨選択
5. Phase 1の実装開始
