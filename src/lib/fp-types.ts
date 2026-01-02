/**
 * 関数型プログラミング用の型定義
 *
 * Result型とOption型を提供し、エラーハンドリングとnull安全性を向上
 */

// ============================================
// Result型 - エラーハンドリング
// ============================================

/**
 * 成功を表す型
 */
export interface Success<T> {
  readonly _tag: "Success";
  readonly value: T;
}

/**
 * 失敗を表す型
 */
export interface Failure<E> {
  readonly _tag: "Failure";
  readonly error: E;
}

/**
 * Result型 - 成功または失敗を表現
 *
 * エラーハンドリングを型安全に行うための型
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * 成功値を生成
 */
export const success = <T>(value: T): Success<T> => ({
  _tag: "Success",
  value,
});

/**
 * 失敗値を生成
 */
export const failure = <E>(error: E): Failure<E> => ({
  _tag: "Failure",
  error,
});

/**
 * Result型が成功かどうかを判定
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
  result._tag === "Success";

/**
 * Result型が失敗かどうかを判定
 */
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> =>
  result._tag === "Failure";

/**
 * Result型の値をマッピング
 */
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  if (isSuccess(result)) {
    return success(fn(result.value));
  }
  return result;
};

/**
 * Result型のエラーをマッピング
 */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  if (isFailure(result)) {
    return failure(fn(result.error));
  }
  return result;
};

/**
 * Result型をflatMapで連鎖
 */
export const flatMapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  if (isSuccess(result)) {
    return fn(result.value);
  }
  return result;
};

/**
 * Result型から値を取り出す（失敗時はデフォルト値）
 */
export const getOrElse = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isSuccess(result)) {
    return result.value;
  }
  return defaultValue;
};

/**
 * Result型をmatchパターンで処理
 */
export const matchResult = <T, E, U>(
  result: Result<T, E>,
  patterns: {
    onSuccess: (value: T) => U;
    onFailure: (error: E) => U;
  }
): U => {
  if (isSuccess(result)) {
    return patterns.onSuccess(result.value);
  }
  return patterns.onFailure(result.error);
};

// ============================================
// Option型 - null安全性
// ============================================

/**
 * 値が存在することを表す型
 */
export interface Some<T> {
  readonly _tag: "Some";
  readonly value: T;
}

/**
 * 値が存在しないことを表す型
 */
export interface None {
  readonly _tag: "None";
}

/**
 * Option型 - 値の存在/非存在を表現
 *
 * null/undefinedを型安全に扱うための型
 */
export type Option<T> = Some<T> | None;

/**
 * 値を持つOptionを生成
 */
export const some = <T>(value: T): Some<T> => ({
  _tag: "Some",
  value,
});

/**
 * 値を持たないOptionを生成
 */
export const none: None = {
  _tag: "None",
};

/**
 * null/undefinedからOptionを生成
 */
export const fromNullable = <T>(value: T | null | undefined): Option<T> => {
  if (value === null || value === undefined) {
    return none;
  }
  return some(value);
};

/**
 * Option型が値を持つかどうかを判定
 */
export const isSome = <T>(option: Option<T>): option is Some<T> => option._tag === "Some";

/**
 * Option型が値を持たないかどうかを判定
 */
export const isNone = <T>(option: Option<T>): option is None => option._tag === "None";

/**
 * Option型の値をマッピング
 */
export const mapOption = <T, U>(option: Option<T>, fn: (value: T) => U): Option<U> => {
  if (isSome(option)) {
    return some(fn(option.value));
  }
  return none;
};

/**
 * Option型をflatMapで連鎖
 */
export const flatMapOption = <T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> => {
  if (isSome(option)) {
    return fn(option.value);
  }
  return none;
};

/**
 * Option型から値を取り出す（None時はデフォルト値）
 */
export const getOptionOrElse = <T>(option: Option<T>, defaultValue: T): T => {
  if (isSome(option)) {
    return option.value;
  }
  return defaultValue;
};

/**
 * Option型をmatchパターンで処理
 */
export const matchOption = <T, U>(
  option: Option<T>,
  patterns: {
    onSome: (value: T) => U;
    onNone: () => U;
  }
): U => {
  if (isSome(option)) {
    return patterns.onSome(option.value);
  }
  return patterns.onNone();
};

/**
 * Option型をnull/undefinedに変換
 */
export const toNullable = <T>(option: Option<T>): T | null => {
  if (isSome(option)) {
    return option.value;
  }
  return null;
};

// ============================================
// ユーティリティ
// ============================================

/**
 * 例外をキャッチしてResult型に変換
 */
export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
  try {
    return success(fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * 非同期例外をキャッチしてResult型に変換
 */
export const tryCatchAsync = async <T>(fn: () => Promise<T>): Promise<Result<T, Error>> => {
  try {
    const value = await fn();
    return success(value);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};
