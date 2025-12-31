/**
 * TypeScript型ユーティリティ
 *
 * 型安全性を高めるための汎用的な型ユーティリティを提供
 * Reference: https://zenn.dev/nokazn/articles/2025-type-utilities
 */

// ============================================
// 基本ユーティリティ
// ============================================

/**
 * オブジェクトの値の型をユニオン型として取得
 *
 * @example
 * const colors = { red: "#f00", blue: "#00f" } as const;
 * type Color = ValueOf<typeof colors>; // "#f00" | "#00f"
 */
export type ValueOf<T> = T[keyof T];

/**
 * オブジェクトを深く掘り下げて値の型を取得
 *
 * @example
 * const config = { api: { url: "https://example.com" } } as const;
 * type ConfigValue = DeepValueOf<typeof config>; // "https://example.com"
 */
export type DeepValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: DeepValueOf<T[K]> }>
  : T;

// ============================================
// 排他的union型
// ============================================

/**
 * OneOf - 複数のキーから1つだけを指定することを強制
 *
 * Reactコンポーネントのpropsで相互排他的な項目を表現
 *
 * @example
 * type IconProps = OneOf<{
 *   iconify: IconifyId;
 *   custom: string;
 * }>;
 * // OK: { iconify: "logos:react" }
 * // OK: { custom: "my-icon.svg" }
 * // NG: { iconify: "logos:react", custom: "my-icon.svg" }
 */
export type OneOf<T extends Record<string, unknown>> = ValueOf<{
  [K in keyof T]: { [P in K]: T[P] } & Partial<Record<Exclude<keyof T, K>, never>>;
}>;

/**
 * OrOf - いずれかの項目を1つ以上指定（複数指定も可）
 *
 * @example
 * type SearchProps = OrOf<{
 *   name: string;
 *   category: TechCategory;
 *   tag: string;
 * }>;
 * // OK: { name: "react" }
 * // OK: { name: "react", category: "library" }
 * // NG: {}
 */
export type OrOf<T> = NonNullable<
  ValueOf<{
    [K in keyof T]: { [P in K]: T[P] } & {
      [P in Exclude<keyof T, K>]?: NonNullable<T[P]>;
    };
  }>
>;

// ============================================
// 必須・オプション制御
// ============================================

/**
 * AllOrNone - すべてのキーを指定するか、すべて指定しない
 *
 * 関連するプロパティをグループ化して強制
 *
 * @example
 * type AuthProps = AllOrNone<{
 *   username: string;
 *   password: string;
 * }>;
 * // OK: { username: "user", password: "pass" }
 * // OK: {}
 * // NG: { username: "user" }
 */
export type AllOrNone<T> =
  | { [K in keyof T]: T[K] | undefined }
  | { [K in keyof T]?: never };

/**
 * RequiredButPossiblyUndefined - すべて必須だが値はundefined可
 *
 * openapi-generatorなどでAPIスキーマ変更時の漏れを防ぐ
 *
 * @example
 * type UpdateUser = RequiredButPossiblyUndefined<{
 *   name?: string;
 *   email?: string;
 * }>;
 * // OK: { name: "John", email: "john@example.com" }
 * // OK: { name: undefined, email: undefined }
 * // NG: {} (キーの指定が必須)
 */
export type RequiredButPossiblyUndefined<T> = {
  [K in keyof Required<T>]: [T[K]] extends [never] ? undefined : T[K];
};

// ============================================
// Readonly制御
// ============================================

/**
 * DeepReadonly - ネストされたオブジェクトもreadonlyに
 *
 * @example
 * type Config = DeepReadonly<{
 *   api: {
 *     url: string;
 *     timeout: number;
 *   };
 * }>;
 * // すべてのプロパティがreadonly
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * Mutable - readonlyを削除
 *
 * @example
 * type ReadonlyUser = { readonly name: string };
 * type MutableUser = Mutable<ReadonlyUser>; // { name: string }
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// ============================================
// 配列・タプル操作
// ============================================

/**
 * NonEmptyArray - 空でない配列
 *
 * @example
 * function first<T>(arr: NonEmptyArray<T>): T {
 *   return arr[0]; // 必ず要素が存在することが保証される
 * }
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Head - 配列の最初の要素の型
 *
 * @example
 * type First = Head<[1, 2, 3]>; // 1
 */
export type Head<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...unknown[]
]
  ? H
  : never;

/**
 * Tail - 配列の最初の要素を除いた残りの型
 *
 * @example
 * type Rest = Tail<[1, 2, 3]>; // [2, 3]
 */
export type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer R
]
  ? R
  : never;

// ============================================
// 文字列操作
// ============================================

/**
 * Split - 文字列を区切り文字で分割してタプル型に
 *
 * @example
 * type IconParts = Split<"logos:react", ":">; // ["logos", "react"]
 */
export type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

/**
 * StartsWith - 文字列が特定のプレフィックスで始まるか
 *
 * @example
 * type IsLogo = StartsWith<"logos:react", "logos">; // true
 */
export type StartsWith<S extends string, P extends string> = S extends `${P}${string}`
  ? true
  : false;

// ============================================
// 条件型ユーティリティ
// ============================================

/**
 * If - 条件に応じて型を選択
 *
 * @example
 * type Result = If<true, "yes", "no">; // "yes"
 */
export type If<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else;

/**
 * IsNever - never型かどうかを判定
 *
 * @example
 * type Check = IsNever<never>; // true
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * IsAny - any型かどうかを判定
 *
 * @example
 * type Check = IsAny<any>; // true
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

// ============================================
// 実用的なヘルパー
// ============================================

/**
 * Prettify - 型エイリアスを展開して読みやすく表示
 *
 * IDEのホバー時に複雑な型を見やすくする
 *
 * @example
 * type Complex = { a: string } & { b: number };
 * type Simple = Prettify<Complex>; // { a: string; b: number }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * PickByValue - 特定の値の型を持つキーのみを抽出
 *
 * @example
 * type StringKeys = PickByValue<{ a: string; b: number; c: string }, string>;
 * // { a: string; c: string }
 */
export type PickByValue<T, V> = Pick<
  T,
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>;

/**
 * OmitByValue - 特定の値の型を持つキーを除外
 *
 * @example
 * type NoStrings = OmitByValue<{ a: string; b: number; c: string }, string>;
 * // { b: number }
 */
export type OmitByValue<T, V> = Pick<
  T,
  { [K in keyof T]: T[K] extends V ? never : K }[keyof T]
>;
