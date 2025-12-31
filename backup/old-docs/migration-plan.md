# アイコン定数リファクタリング - 詳細移行計画

## 概要

このドキュメントは、現在のアイコン管理システムから新しい型安全なシステムへの移行手順を詳細に記述します。

## 移行の原則

1. **段階的な移行**: 一度にすべてを変更せず、段階的に移行
2. **後方互換性の維持**: 移行中も既存コードが動作する状態を保つ
3. **型安全性の最大化**: Zod + Branded Typesで完全な型安全性を実現
4. **自動検証**: ビルド時・実行時の両方でデータ整合性を保証

## 前提条件

- ✅ Zod v4.2.1がインストール済み
- ✅ TypeScript v5が使用可能
- ✅ Next.js v16.1.1の環境
- ✅ simple-icons v16.3.0が利用可能

## Phase 0: 準備フェーズ

### 0-1. 現状のバックアップ

```bash
# 現在のファイルをバックアップ
cp src/lib/iconMapping.ts src/lib/iconMapping.ts.backup
cp src/constants/techStack.ts src/constants/techStack.ts.backup
cp src/lib/techLinks.ts src/lib/techLinks.ts.backup
cp src/types/tech.ts src/types/tech.ts.backup
```

### 0-2. データの整合性チェックスクリプト作成

```typescript
// scripts/check-data-consistency.ts
import { TECH_STACK_LIST } from '@/constants/techStack';
import { iconMapping } from '@/lib/iconMapping';
import { techLinks } from '@/lib/techLinks';

interface ConsistencyReport {
  totalTechItems: number;
  totalIconMappings: number;
  totalLinks: number;
  missingInIconMapping: string[];
  missingInTechStack: string[];
  missingLinks: string[];
}

function checkConsistency(): ConsistencyReport {
  const techIds = new Set(TECH_STACK_LIST.map(item => item.id));
  const iconIds = new Set(Object.keys(iconMapping));
  const linkIds = new Set(Object.keys(techLinks));

  const missingInIconMapping = TECH_STACK_LIST
    .filter(item => !iconIds.has(item.id))
    .map(item => item.id);

  const missingInTechStack = Array.from(iconIds)
    .filter(id => !techIds.has(id));

  const missingLinks = TECH_STACK_LIST
    .filter(item => !linkIds.has(item.id))
    .map(item => item.id);

  return {
    totalTechItems: TECH_STACK_LIST.length,
    totalIconMappings: iconIds.size,
    totalLinks: linkIds.size,
    missingInIconMapping,
    missingInTechStack,
    missingLinks,
  };
}

const report = checkConsistency();
console.log('=== Data Consistency Report ===');
console.log(`Tech Items: ${report.totalTechItems}`);
console.log(`Icon Mappings: ${report.totalIconMappings}`);
console.log(`Links: ${report.totalLinks}`);
console.log('\n=== Issues ===');
console.log(`Missing in iconMapping (${report.missingInIconMapping.length}):`, report.missingInIconMapping);
console.log(`Missing in techStack (${report.missingInTechStack.length}):`, report.missingInTechStack);
console.log(`Missing links (${report.missingLinks.length}):`, report.missingLinks);
```

**実行方法:**

```bash
npm install -D tsx
npx tsx scripts/check-data-consistency.ts
```

### 0-3. package.jsonにスクリプト追加

```json
{
  "scripts": {
    "check:data": "tsx scripts/check-data-consistency.ts",
    "validate:icons": "tsx scripts/validate-icons.ts",
    "validate:all": "npm run check:data && npm run validate:icons",
    "migrate:data": "tsx scripts/migrate-to-new-schema.ts"
  }
}
```

## Phase 1: 新しい型システムの実装

### 1-1. 新しい型定義の作成

**ファイル:** `src/types/tech.new.ts`

```typescript
import { z } from 'zod';

// ============================================
// Branded Types
// ============================================

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

// ============================================
// Enums
// ============================================

export enum TechCategory {
  Language = 'language',
  Framework = 'framework',
  Library = 'library',
  Platform = 'platform',
  Cloud = 'cloud',
  Database = 'database',
  CICD = 'cicd',
  BuildTool = 'buildtool',
  Testing = 'testing',        // NEW
  MessageQueue = 'messagequeue', // NEW
  Monitoring = 'monitoring',   // NEW
  Editor = 'editor',           // NEW
  Design = 'design',           // NEW
  Other = 'other',
}

// ============================================
// Schemas
// ============================================

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

export type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

// ============================================
// Creator Functions
// ============================================

export const createTechId = (id: string): TechId => TechIdSchema.parse(id);
export const createIconifyId = (id: string): IconifyId => IconifyIdSchema.parse(id);
export const createTechLink = (url: string): TechLink => TechLinkSchema.parse(url);

// ============================================
// Unsafe Creators (for migration only)
// ============================================

export const unsafeCreateTechId = (id: string): TechId => id as TechId;
export const unsafeCreateIconifyId = (id: string): IconifyId => id as IconifyId;
export const unsafeCreateTechLink = (url: string): TechLink => url as TechLink;
```

### 1-2. データ移行スクリプトの作成

**ファイル:** `scripts/migrate-to-new-schema.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { TECH_STACK_LIST } from '../src/constants/techStack';
import { iconMapping } from '../src/lib/iconMapping';
import { techLinks } from '../src/lib/techLinks';
import type { TechCategory } from '../src/types/tech';

interface NewTechItem {
  id: string;
  name: string;
  category: TechCategory;
  iconify: string;
  link?: string;
}

function migrateData(): Record<string, NewTechItem> {
  const result: Record<string, NewTechItem> = {};

  TECH_STACK_LIST.forEach(item => {
    const iconifyId = iconMapping[item.id];
    const link = techLinks[item.id];

    if (!iconifyId) {
      console.warn(`⚠️  Missing iconify mapping for: ${item.id}`);
    }

    result[item.id] = {
      id: item.id,
      name: item.name,
      category: item.category,
      iconify: iconifyId || `logos:${item.id}`,
      ...(link && { link }),
    };
  });

  return result;
}

function generateTechStackFile(data: Record<string, NewTechItem>): string {
  const entries = Object.entries(data)
    .map(([id, item]) => {
      const linkPart = item.link ? `\n    link: "${item.link}",` : '';
      return `  "${id}": {
    id: "${item.id}",
    name: "${item.name}",
    category: TechCategory.${item.category.charAt(0).toUpperCase() + item.category.slice(1)},
    iconify: "${item.iconify}",${linkPart}
  }`;
    })
    .join(',\n');

  return `import type { TechId, TechItem } from '@/types/tech.new';
import { TechCategory } from '@/types/tech.new';

/**
 * Tech Stack Data
 *
 * Single source of truth for all technology information.
 * Includes icon mappings and links in one place.
 */
export const TECH_STACK = {
${entries}
} as const satisfies Record<string, TechItem>;

// Type-safe tech ID list
export const TECH_IDS = Object.keys(TECH_STACK) as TechId[];

// Array format for backward compatibility
export const TECH_STACK_LIST: TechItem[] = Object.values(TECH_STACK);

// Type-safe getter
export function getTechById(id: TechId): TechItem {
  return TECH_STACK[id];
}

// Safe getter with validation
export function getTechByIdSafe(id: string): TechItem | undefined {
  return TECH_STACK[id as TechId];
}
`;
}

// Execute migration
console.log('🚀 Starting data migration...\n');

const migratedData = migrateData();
const newFileContent = generateTechStackFile(migratedData);

const outputPath = path.join(__dirname, '../src/constants/techStack.new.ts');
fs.writeFileSync(outputPath, newFileContent, 'utf-8');

console.log(`✅ Migration complete!`);
console.log(`📝 New file created: ${outputPath}`);
console.log(`📊 Total items: ${Object.keys(migratedData).length}`);
console.log('\n⚠️  Please review the new file before replacing the old one.');
```

**実行方法:**

```bash
npm run migrate:data
```

### 1-3. カテゴリの見直し

**手動で確認・修正が必要な項目:**

```typescript
// scripts/review-categories.ts
const CATEGORY_SUGGESTIONS = {
  jest: 'Testing',          // Other → Testing
  vitest: 'Testing',        // Other → Testing
  cypress: 'Testing',       // Library → Testing
  selenium: 'Testing',      // Library → Testing

  kafka: 'MessageQueue',    // Other → MessageQueue
  rabbitmq: 'MessageQueue', // Other → MessageQueue

  grafana: 'Monitoring',    // Other → Monitoring
  prometheus: 'Monitoring', // Other → Monitoring
  sentry: 'Monitoring',     // Other → Monitoring

  vscode: 'Editor',         // Other → Editor
  vim: 'Editor',            // Other → Editor
  neovim: 'Editor',         // Platform → Editor
  idea: 'Editor',           // Platform → Editor

  figma: 'Design',          // Other → Design
  ae: 'Design',             // Other → Design (After Effects)
  ps: 'Design',             // Other → Design (Photoshop)
  pr: 'Design',             // Other → Design (Premiere Pro)
};

// 移行後に手動で修正
```

## Phase 2: 段階的な移行

### 2-1. 並行運用の準備

**ファイル:** `src/lib/techStackAdapter.ts`

```typescript
import type { TechItem as OldTechItem } from '@/types/tech';
import type { TechItem as NewTechItem } from '@/types/tech.new';
import { TECH_STACK as NEW_TECH_STACK } from '@/constants/techStack.new';
import { unsafeCreateTechId, unsafeCreateIconifyId, unsafeCreateTechLink } from '@/types/tech.new';

/**
 * Adapter to convert old TechItem to new TechItem
 * Used during migration period
 */
export function adaptOldToNew(oldItem: OldTechItem): NewTechItem {
  const newItem = NEW_TECH_STACK[oldItem.id];
  if (!newItem) {
    throw new Error(`Tech item not found: ${oldItem.id}`);
  }
  return newItem;
}

/**
 * Get iconify ID from tech ID (backward compatible)
 */
export function getIconifyIcon(techId: string): string {
  const tech = NEW_TECH_STACK[techId];
  return tech?.iconify || `logos:${techId}`;
}

/**
 * Get tech link from tech ID (backward compatible)
 */
export function getTechLink(techId: string, techName: string): string {
  const tech = NEW_TECH_STACK[techId];
  return tech?.link || `https://simpleicons.org/?q=${encodeURIComponent(techName)}`;
}
```

### 2-2. コンポーネントの移行順序

**優先順位:**

1. **高優先度 (即座に移行)**
   - [TechIconGrid.tsx](src/components/generator/TechIconGrid.tsx) - アイコン表示の中核
   - [IconGridGenerator.tsx](src/components/generator/IconGridGenerator.tsx) - メインジェネレーター

2. **中優先度 (Phase 2で移行)**
   - その他のコンポーネント

### 2-3. TechIconGrid の移行

**Before:**

```typescript
import { getIconifyIcon } from "@/lib/iconMapping";

const iconifyIcon = getIconifyIcon(iconId);
```

**After:**

```typescript
import { TECH_STACK } from "@/constants/techStack.new";
import type { TechId } from "@/types/tech.new";

const tech = TECH_STACK[iconId as TechId];
const iconifyIcon = tech.iconify;
```

**移行ステップ:**

```typescript
// Step 1: Import both old and new
import { getIconifyIcon } from "@/lib/iconMapping";
import { TECH_STACK } from "@/constants/techStack.new";

// Step 2: Use adapter during migration
const iconifyIcon = TECH_STACK[iconId]?.iconify || getIconifyIcon(iconId);

// Step 3: Remove old import after testing
```

### 2-4. IconGridGenerator の移行

**主な変更点:**

```typescript
// Before
import { getIconifyIcon } from "@/lib/iconMapping";
import { getTechLink } from "@/lib/techLinks";
import type { TechItem } from "@/types/tech";

const iconifyId = getIconifyIcon(tech.id);
const link = getTechLink(tech.id, tech.name);

// After
import { TECH_STACK } from "@/constants/techStack.new";
import type { TechItem, TechId } from "@/types/tech.new";

const tech = TECH_STACK[techId];
const iconifyId = tech.iconify;
const link = tech.link || `https://simpleicons.org/?q=${encodeURIComponent(tech.name)}`;
```

## Phase 3: バリデーションとテスト

### 3-1. Zodバリデーションの追加

**ファイル:** `src/constants/techStack.new.ts` (末尾に追加)

```typescript
// Validate all tech items at build time
if (process.env.NODE_ENV !== 'production') {
  TECH_STACK_LIST.forEach(item => {
    const result = TechItemSchema.safeParse(item);
    if (!result.success) {
      console.error(`❌ Invalid tech item: ${item.id}`);
      console.error(result.error.format());
      throw new Error(`Tech data validation failed for: ${item.id}`);
    }
  });
  console.log(`✅ All ${TECH_STACK_LIST.length} tech items validated successfully`);
}
```

### 3-2. アイコン存在チェックスクリプト

**ファイル:** `scripts/validate-icons.ts`

```typescript
import { TECH_STACK_LIST } from '../src/constants/techStack.new';

/**
 * Iconify APIでアイコンの存在を確認
 *
 * 基本的にはIconifyを使用する方針。
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
    // Iconify APIで存在確認（統一された方法）
    const response = await fetch(
      `https://api.iconify.design/${iconifyId}.svg`,
      { method: 'HEAD' }
    );

    if (!response.ok) {
      console.warn(`⚠️  Icon not found via Iconify API: ${iconifyId} (Status: ${response.status})`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error checking Iconify API for ${iconifyId}:`, error);
    return false;
  }
}

async function validateAllIcons() {
  console.log('🔍 Validating all icons via Iconify API...\n');
  console.log('ℹ️  Using Iconify as the primary icon provider\n');

  const results = await Promise.all(
    TECH_STACK_LIST.map(async (tech) => {
      const isValid = await validateIconifyIcon(tech.iconify);
      return { tech, isValid };
    })
  );

  const invalid = results.filter(r => !r.isValid);

  if (invalid.length > 0) {
    console.error(`\n❌ Found ${invalid.length} invalid icons:\n`);
    invalid.forEach(({ tech }) => {
      console.error(`  - ${tech.id}: ${tech.iconify}`);
    });
    console.error('\n💡 Tip: Check available icons at https://icon-sets.iconify.design/');
    process.exit(1);
  }

  console.log(`\n✅ All ${TECH_STACK_LIST.length} icons are valid!`);

  // アイコンプロバイダーの分布を表示
  const prefixCount: Record<string, number> = {};
  TECH_STACK_LIST.forEach(tech => {
    const prefix = tech.iconify.split(':')[0];
    prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
  });

  console.log('\n📊 Icon provider distribution:');
  Object.entries(prefixCount)
    .sort(([, a], [, b]) => b - a)
    .forEach(([prefix, count]) => {
      console.log(`  - ${prefix}: ${count} icons`);
    });
}

validateAllIcons();
```

### 3-3. テストチェックリスト

```markdown
## Manual Testing Checklist

- [ ] アイコンが正しく表示される
- [ ] アイコンの並び順が保持される
- [ ] リンクが正しく機能する
- [ ] ドラッグ&ドロップが動作する
- [ ] カテゴリフィルターが動作する
- [ ] 検索機能が動作する
- [ ] Markdownコピーが正しく動作する
- [ ] ビルドエラーがない
- [ ] 型エラーがない
- [ ] パフォーマンスに問題がない
```

## Phase 4: 旧ファイルのクリーンアップ

### 4-1. 旧ファイルの削除

すべてのテストが通過したら:

```bash
# 旧ファイルをバックアップディレクトリに移動
mkdir -p .backup/old-icon-system
mv src/lib/iconMapping.ts .backup/old-icon-system/
mv src/lib/techLinks.ts .backup/old-icon-system/
mv src/types/tech.ts .backup/old-icon-system/

# 新ファイルをリネーム
mv src/types/tech.new.ts src/types/tech.ts
mv src/constants/techStack.new.ts src/constants/techStack.ts
```

### 4-2. Import文の一括置換

```bash
# tech.new → tech に一括置換
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/@\/types\/tech.new/@\/types\/tech/g'
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/@\/constants\/techStack.new/@\/constants\/techStack/g'
```

### 4-3. 未使用のアダプターコードの削除

```bash
rm src/lib/techStackAdapter.ts
```

## Phase 5: 追加機能の実装

### 5-1. CI/CD統合

**ファイル:** `.github/workflows/validate-tech-data.yml`

```yaml
name: Validate Tech Data

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check data consistency
        run: npm run check:data

      - name: Validate icons
        run: npm run validate:icons

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build
```

### 5-2. Pre-commit Hook

**ファイル:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run check:data
npm run validate:icons
```

## ロールバック計画

万が一問題が発生した場合:

```bash
# バックアップから復元
cp .backup/old-icon-system/iconMapping.ts src/lib/
cp .backup/old-icon-system/techLinks.ts src/lib/
cp .backup/old-icon-system/tech.ts src/types/

# git で復元
git checkout HEAD -- src/lib/iconMapping.ts
git checkout HEAD -- src/lib/techLinks.ts
git checkout HEAD -- src/types/tech.ts
git checkout HEAD -- src/constants/techStack.ts
```

## 移行スケジュール

| Phase | タスク | 所要時間（目安） | 担当 | 状態 |
|-------|--------|------------------|------|------|
| 0 | 準備・バックアップ | 30分 | - | ⬜ 未着手 |
| 1 | 新型システム実装 | 2時間 | - | ⬜ 未着手 |
| 2 | 段階的移行 | 3時間 | - | ⬜ 未着手 |
| 3 | バリデーション・テスト | 2時間 | - | ⬜ 未着手 |
| 4 | クリーンアップ | 1時間 | - | ⬜ 未着手 |
| 5 | 追加機能実装 | 1時間 | - | ⬜ 未着手 |

**合計所要時間: 約9-10時間**

## 成功基準

- [x] すべてのアイコンが正しく表示される
- [x] 型エラーがゼロ
- [x] ビルドが成功する
- [x] すべての既存機能が動作する
- [x] データ検証が自動化されている
- [x] CI/CDが正常に動作する

## 次のステップ

1. このプランのレビューと承認を得る
2. Phase 0を実行してデータの現状を把握
3. Phase 1の実装を開始
4. 各Phaseごとにテストを実施
5. 問題がなければ次のPhaseへ進む

---

**作成日:** 2025-12-31
**最終更新:** 2025-12-31
**ステータス:** レビュー待ち
