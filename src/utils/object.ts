/**
 * 简单的克隆，不能在有大对象的情况下使用.
 *
 */
export function deepClone<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}
