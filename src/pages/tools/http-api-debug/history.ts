import { openDbStore } from '@/utils/indexed-db'
import { Method, Parameter, RequestContentType } from './commons'

const storePromise = openDbStore<History>('http-api-debug-history')

/**
 * 历史记录条目.
 */
export interface History {
  url: string
  method: Method
  timeout: number // 超时时间，单位毫秒
  headers: Record<string, string>
  contentType: RequestContentType
  textContent: string
  jsonContent: string
  parameters: Parameter[]
}

export async function findAllHistories(): Promise<History[]> {
  const store = await storePromise
  return await store.findAll()
}

/**
 * 添加历史记录.
 */
export async function addHistory(history: History): Promise<void> {
  // 最多只存 1000 条
  const store = await storePromise
  const count = await store.count()
  // 从前面删除多余的
  if (count > 1000) {
    const list = await store.findByIdGreaterThan(0, count - 1000)
    await Promise.all(list.map(record => store.deleteById(record.id)))
  }
  await store.create(history)
}
