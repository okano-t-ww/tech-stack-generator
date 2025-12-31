# 関数型プログラミング (FP) ルール

このプロジェクトでは、**実用的な関数型プログラミング**の原則を採用します。
純粋なFPではなく、TypeScriptとReactのエコシステムに適した、バランスの取れたアプローチを目指します。

## 核心原則

### 1. イミュータビリティ（不変性）

**原則**: データを変更せず、新しいデータを作成する

#### ✅ Good - プロジェクト実例
```typescript
// TechStackService.ts - フィルタリング
static filterByCategories(categories: TechCategory[]): TechItem[] {
  return TECH_STACK_LIST.filter((tech) => categories.includes(tech.category));
}

// useTechSelection.ts - State更新
const toggle = useCallback((tech: TechItem) => {
  setSelected((prev) =>
    prev.some((item) => item.id === tech.id)
      ? prev.filter((item) => item.id !== tech.id)  // 削除
      : [...prev, tech]                              // 追加
  );
}, []);

// ネストしたオブジェクト更新
const updateTheme = (theme: Theme, mode: 'light' | 'dark') => ({
  ...theme,
  colors: {
    ...theme.colors,
    mode,
  },
});
```

#### ❌ Bad - ミューテーション
```typescript
// State を直接変更
const toggle = (tech: TechItem) => {
  selected.push(tech); // ❌ 直接変更
  setSelected(selected); // ❌ 同じ参照
};

// 配列メソッドの誤用
const items = [...TECH_STACK_LIST];
items.sort(); // ❌ 元の配列を変更
return items;

// オブジェクトの直接変更
tech.name = 'Updated'; // ❌
```

#### 💡 パフォーマンスのヒント
```typescript
// 大量データの場合、適切な最適化を
// ❌ 毎回全配列をコピー（大量データで非効率）
const addMany = (items: TechItem[], newItems: TechItem[]) => {
  let result = items;
  newItems.forEach(item => {
    result = [...result, item]; // O(n²)
  });
  return result;
};

// ✅ 一度にまとめてコピー
const addMany = (items: TechItem[], newItems: TechItem[]) =>
  [...items, ...newItems]; // O(n)
```

---

### 2. 純粋関数（Pure Functions）

**原則**: 同じ入力 → 同じ出力、副作用なし

#### ✅ Good - サービス層の純粋関数
```typescript
// TechStackService.ts
static getById(id: TechId): TechItem | undefined {
  return TECH_STACK[id as keyof typeof TECH_STACK];
}

static search(keyword: string): TechItem[] {
  const query = keyword.toLowerCase();
  return TECH_STACK_LIST.filter((tech) =>
    tech.name.toLowerCase().includes(query)
  );
}

// MarkdownService.ts - 純粋な変換ロジック
static generate(
  selectedTechs: TechItem[],
  format: OutputFormat,
  iconSize: number
): string {
  const icons = selectedTechs
    .map((tech) => this.generateIcon(tech, format, iconSize))
    .join(' ');

  return `<p align="center">\n  ${icons}\n</p>`;
}
```

#### ✅ 副作用の分離
```typescript
// ❌ 純粋関数内で副作用
function saveAndReturn(tech: TechItem): TechItem {
  localStorage.setItem('tech', JSON.stringify(tech)); // ❌ 副作用
  console.log('Saved:', tech); // ❌ 副作用
  return tech;
}

// ✅ 副作用を分離
function saveTech(tech: TechItem): void {
  localStorage.setItem('tech', JSON.stringify(tech));
  console.log('Saved:', tech);
}

function processTech(tech: TechItem): TechItem {
  // 純粋な処理のみ
  return { ...tech, processedAt: Date.now() };
}

// 使用時
const processed = processTech(tech);
saveTech(processed); // 副作用は明示的に実行
```

#### 💡 許容される副作用
```typescript
// ✅ React Hooks内の副作用は適切
useEffect(() => {
  // 副作用はuseEffectに集約
  localStorage.setItem('selected', JSON.stringify(selected));
}, [selected]);

// ✅ イベントハンドラ内の副作用も適切
const handleCopy = async () => {
  await navigator.clipboard.writeText(markdown);
  toast({ title: "Copied!" });
};
```

---

### 3. 型による表現力の向上

**TypeScriptの型システムを活用し、実行時エラーを防ぐ**

#### ✅ Good - 型で状態を表現
```typescript
// Either型 - エラーハンドリングを型で表現
type Either<E, A> =
  | { _tag: 'Left'; left: E }
  | { _tag: 'Right'; right: A };

const left = <E, A>(e: E): Either<E, A> =>
  ({ _tag: 'Left', left: e });
const right = <E, A>(a: A): Either<E, A> =>
  ({ _tag: 'Right', right: a });

// 使用例
async function validateIcon(id: IconifyId): Promise<Either<string, boolean>> {
  try {
    const response = await fetch(`https://api.iconify.design/${id}.svg`);
    return right(response.ok);
  } catch (error) {
    return left(error instanceof Error ? error.message : 'Unknown error');
  }
}

// パターンマッチング風に処理
const result = await validateIcon('logos:react');
if (result._tag === 'Left') {
  console.error('Validation failed:', result.left);
} else {
  console.log('Valid:', result.right);
}
```

#### ✅ Option型 - null/undefinedを型安全に
```typescript
type Option<T> = T | undefined;

// ヘルパー関数
const map = <T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> =>
  opt === undefined ? undefined : fn(opt);

const getOrElse = <T>(opt: Option<T>, defaultValue: T): T =>
  opt === undefined ? defaultValue : opt;

// 使用例
const tech = TechStackService.getById(id); // Option<TechItem>
const name = map(tech, t => t.name);
const displayName = getOrElse(name, 'Unknown');
```

#### ✅ 判別共用体（Discriminated Union）
```typescript
// 状態を型で明確に表現
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// 型安全な状態管理
function render<T>(state: LoadingState<T>): React.ReactNode {
  switch (state.status) {
    case 'idle':
      return <div>Click to load</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data}</div>; // data は型安全
    case 'error':
      return <div>Error: {state.error}</div>; // error は型安全
  }
}
```

---

### 4. 関数合成とパイプライン

**小さな関数を組み合わせて複雑な処理を構築**

#### ✅ Good - 実践的なパイプライン
```typescript
// ユーティリティ関数
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) => fns.reduce((acc, fn) => fn(acc), value);

// 小さな純粋関数を定義
const filterByCategory = (category: TechCategory) =>
  (items: TechItem[]) => items.filter(item => item.category === category);

const sortByName = (items: TechItem[]) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name));

const take = (n: number) => <T>(items: T[]) => items.slice(0, n);

const mapToNames = (items: TechItem[]) => items.map(item => item.name);

// 合成して複雑な処理を構築
const getTopFrameworkNames = pipe(
  filterByCategory(TechCategory.Framework),
  sortByName,
  take(10),
  mapToNames
);

const result = getTopFrameworkNames(TECH_STACK_LIST);
```

#### ✅ 実際のプロジェクトでの活用
```typescript
// entities/tech/lib/utils.ts に配置
export const createTechFilter = (predicate: (tech: TechItem) => boolean) =>
  (items: TechItem[]) => items.filter(predicate);

export const sortTech = (compareFn: (a: TechItem, b: TechItem) => number) =>
  (items: TechItem[]) => [...items].sort(compareFn);

// features/tech-selection で使用
const filterActive = createTechFilter(tech => tech.isActive);
const sortByName = sortTech((a, b) => a.name.localeCompare(b.name));

const getActiveTechsSorted = pipe(
  filterActive,
  sortByName
);
```

---

### 5. 高階関数の活用

#### ✅ カリー化（Currying）
```typescript
// カリー化されたフィルター
const filterBy = <T>(key: keyof T) =>
  (value: T[typeof key]) =>
    (items: T[]) => items.filter(item => item[key] === value);

// 部分適用で再利用可能な関数を作成
const filterByCategory = filterBy<TechItem>('category');
const getFrameworks = filterByCategory(TechCategory.Framework);
const getLibraries = filterByCategory(TechCategory.Library);

// 使用
const frameworks = getFrameworks(TECH_STACK_LIST);
const libraries = getLibraries(TECH_STACK_LIST);
```

#### ✅ 関数ファクトリー
```typescript
// Markdown生成のファクトリー
const createMarkdownGenerator = (format: OutputFormat) =>
  (iconSize: number) =>
    (techs: TechItem[]) =>
      MarkdownService.generate(techs, format, iconSize);

// 特定の設定で固定
const generateSingle = createMarkdownGenerator('single');
const generateSingle48 = generateSingle(48);

// 使用
const markdown = generateSingle48(selectedTechs);
```

---

## React での FP 実践

### 1. Hooks はロジックのカプセル化

#### ✅ Good - 純粋なロジックをHooksに
```typescript
// features/tech-selection/model/useTechSelection.ts
export function useTechSelection(initialItems: TechItem[] = []) {
  const [selected, setSelected] = useState<TechItem[]>(initialItems);

  // 純粋な更新ロジック
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

  // 派生状態は useMemo で計算
  const stats = useMemo(
    () => ({
      count: selected.length,
      isEmpty: selected.length === 0,
      ids: selected.map((tech) => tech.id),
    }),
    [selected]
  );

  return { selected, toggle, selectAll, clear, stats };
}
```

### 2. コンポーネントは純粋関数のように

#### ✅ Good - プレゼンテーショナルコンポーネント
```typescript
// 純粋なコンポーネント - props → UI
interface TechCardProps {
  tech: TechItem;
  isSelected: boolean;
  onToggle: (tech: TechItem) => void;
}

export function TechCard({ tech, isSelected, onToggle }: TechCardProps) {
  return (
    <div onClick={() => onToggle(tech)}>
      <img src={IconifyService.getIconUrl(tech.iconify)} alt={tech.name} />
      <span>{tech.name}</span>
      {isSelected && <CheckIcon />}
    </div>
  );
}
```

### 3. 副作用の明示的な分離

#### ✅ Good - useEffect で副作用を集約
```typescript
function TechSelector() {
  const { selected, toggle } = useTechSelection();
  const [markdown, setMarkdown] = useState('');

  // 副作用1: LocalStorage への保存
  useEffect(() => {
    localStorage.setItem('selected', JSON.stringify(selected));
  }, [selected]);

  // 副作用2: Analytics
  useEffect(() => {
    if (selected.length > 0) {
      analytics.track('tech_selected', { count: selected.length });
    }
  }, [selected.length]);

  // 副作用3: Markdown生成（非同期）
  useEffect(() => {
    const md = MarkdownService.generate(selected, 'single', 48);
    setMarkdown(md);
  }, [selected]);

  return (
    // 純粋なレンダリング
    <div>{/* ... */}</div>
  );
}
```

---

## 実践的パターン集

### Pattern 1: Maybe/Option パターン
```typescript
// shared/lib/maybe.ts
export const mapOption = <T, U>(
  value: T | undefined,
  fn: (v: T) => U
): U | undefined => (value === undefined ? undefined : fn(value));

export const flatMapOption = <T, U>(
  value: T | undefined,
  fn: (v: T) => U | undefined
): U | undefined => (value === undefined ? undefined : fn(value));

// 使用例
const tech = TechStackService.getById(id);
const iconUrl = mapOption(tech, t => IconifyService.getIconUrl(t.iconify));
const displayUrl = iconUrl ?? '/default-icon.svg';
```

### Pattern 2: Result/Either パターン
```typescript
// shared/lib/result.ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> =>
  result.ok ? ok(fn(result.value)) : result;

// 使用例
async function fetchTechData(id: string): Promise<Result<TechItem, string>> {
  try {
    const response = await fetch(`/api/tech/${id}`);
    if (!response.ok) {
      return err(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Unknown error');
  }
}
```

### Pattern 3: 配列の便利なヘルパー
```typescript
// shared/lib/array.ts
export const groupBy = <T>(
  items: T[],
  key: keyof T
): Record<string, T[]> =>
  items.reduce((acc, item) => {
    const group = String(item[key]);
    return {
      ...acc,
      [group]: [...(acc[group] || []), item],
    };
  }, {} as Record<string, T[]>);

export const uniqueBy = <T>(items: T[], key: keyof T): T[] => {
  const seen = new Set();
  return items.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// 使用例
const grouped = groupBy(TECH_STACK_LIST, 'category');
const unique = uniqueBy(items, 'id');
```

---

## 避けるべきこと

### ❌ 過度な抽象化
```typescript
// ❌ やりすぎ - 読みづらい
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
  (a: A) => f(g(a));

const map = <T, U>(fn: (t: T) => U) =>
  (arr: T[]) => arr.map(fn);

const filter = <T>(pred: (t: T) => boolean) =>
  (arr: T[]) => arr.filter(pred);

// ✅ シンプルに
const getActiveFrameworks = (items: TechItem[]) =>
  items
    .filter(item => item.category === TechCategory.Framework)
    .filter(item => item.isActive);
```

### ❌ 不必要なカリー化
```typescript
// ❌ 1回しか使わないのにカリー化
const add = (a: number) => (b: number) => a + b;
const result = add(1)(2);

// ✅ 普通の関数で十分
const add = (a: number, b: number) => a + b;
const result = add(1, 2);
```

### ✅ バランスの取れたアプローチ
```typescript
// 再利用性が高い → カリー化が有効
const filterBy = <T>(key: keyof T) => (value: T[typeof key]) =>
  (items: T[]) => items.filter(item => item[key] === value);

// 一度しか使わない → 普通の関数
const getSelectedIds = (items: TechItem[]) => items.map(item => item.id);
```

---

## パフォーマンスとのバランス

### 適切なメモ化
```typescript
// ✅ 重い計算はメモ化
const expensiveComputation = useMemo(() => {
  return items
    .filter(complexFilter)
    .map(expensiveTransform)
    .sort(complexSort);
}, [items]);

// ❌ 軽い計算は不要
const simpleValue = useMemo(() => item.name, [item]); // 不要
```

### イミュータブル操作の最適化
```typescript
// ❌ 非効率 - O(n²)
let result = [];
for (const item of items) {
  result = [...result, item];
}

// ✅ 効率的 - O(n)
const result = items.slice(); // または [...items]

// ✅ 大量データは適切な構造を
import { List } from 'immutable';
const list = List(items);
const updated = list.push(newItem); // O(1) に近い
```

---

## まとめ

### FP の利点（このプロジェクトで）
1. **予測可能性**: 純粋関数は同じ入力で同じ出力
2. **テスタビリティ**: 副作用がないためユニットテスト容易
3. **並行処理安全**: イミュータブルなデータは競合しない
4. **バグの少なさ**: ミューテーションバグを防ぐ
5. **リファクタリング容易**: 依存関係が明確

### 実践ガイドライン
✅ **常に実践**
- State更新はイミュータブルに
- 純粋関数を優先
- map/filter/reduce を活用
- 副作用は明示的に分離

✅ **状況に応じて**
- 関数合成（複雑な処理の場合）
- カリー化（再利用性が高い場合）
- Option/Result型（エラーハンドリング）

❌ **避ける**
- 過度な抽象化
- 不要なメモ化
- 読みづらいコード
- パフォーマンス無視

### プラグマティックFP
完璧なFPよりも、**チームが理解しやすく、保守しやすいコード**を目指します。

## 参考資料

- [fp-ts](https://gcanti.github.io/fp-ts/) - TypeScript FP ライブラリ
- [Ramda](https://ramdajs.com/) - FP ユーティリティ
- [React Hooks FP](https://kentcdodds.com/blog/react-hooks-pitfalls)
- [Immutability in React](https://react.dev/learn/updating-objects-in-state)
