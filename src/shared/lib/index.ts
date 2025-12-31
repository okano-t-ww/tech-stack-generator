/**
 * Shared Library
 *
 * プロジェクト全体で使用する共通ライブラリ
 */

// Utilities
export { cn } from './utils';

// Functional Programming Types
export {
  // Result型
  type Result,
  type Success,
  type Failure,
  success,
  failure,
  isSuccess,
  isFailure,
  mapResult,
  mapError,
  flatMapResult,
  getOrElse,
  matchResult,
  // Option型
  type Option,
  type Some,
  type None,
  some,
  none,
  fromNullable,
  isSome,
  isNone,
  mapOption,
  flatMapOption,
  getOptionOrElse,
  matchOption,
  toNullable,
  // ユーティリティ
  tryCatch,
  tryCatchAsync,
} from './fp-types';

// Type Utilities
export type {
  // 基本ユーティリティ
  ValueOf,
  DeepValueOf,
  // 排他的union型
  OneOf,
  OrOf,
  // 必須・オプション制御
  AllOrNone,
  RequiredButPossiblyUndefined,
  // Readonly制御
  DeepReadonly,
  Mutable,
  // 配列・タプル操作
  NonEmptyArray,
  Head,
  Tail,
  // 文字列操作
  Split,
  StartsWith,
  // 条件型ユーティリティ
  If,
  IsNever,
  IsAny,
  // 実用的なヘルパー
  Prettify,
  PickByValue,
  OmitByValue,
} from './type-utils';
