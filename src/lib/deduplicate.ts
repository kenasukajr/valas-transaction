/**
 * Deduplicate an array of objects by a specified key.
 * @param array The array of objects to deduplicate.
 * @param key The key to use for uniqueness.
 * @returns A new array with unique objects based on the key.
 */
export function deduplicateByKey<T>(array: T[], key: keyof T): T[] {
  const uniqueMap = new Map<unknown, T>()
  array.forEach(item => {
    const keyValue = item[key]
    if (!uniqueMap.has(keyValue)) {
      uniqueMap.set(keyValue, item)
    }
  })
  return Array.from(uniqueMap.values())
}
