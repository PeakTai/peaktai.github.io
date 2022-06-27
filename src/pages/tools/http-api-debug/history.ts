import { deepClone } from '@/utils/object'
import { DbStore, getOrCreateDbStore } from '@/utils/indexed-db'
import { Entity } from './../../../utils/indexed-db'
import { Method, RequestContentType, Header, Parameter } from './commons'

export interface History {
  url: string
  method: Method
  timeout: number // 超时时间，单位毫秒
  headers: Header[]
  contentType: RequestContentType
  referrerPolicy: ReferrerPolicy
  textContent: string
  jsonContent: string
  parameters: Parameter[]
}

function getStore(): Promise<DbStore<History>> {
  return getOrCreateDbStore<History>('http-api-debug-history')
}

/**
 * 这里将历史记录缓存，并保持与 indexedDB 同步，通过事件可同步实时信息，多个组件共享.
 * 之前尝试过 pinia ，但是 difineStore 必须在安装插件后调用，vue3 需要先创建 app 再安装插件，
 * 但是 APP 引用的文件调用了 difineStore，要处理好这个问题非常的麻烦，最终还是没有用起来，实践下来目前的方法最简单.
 */
let _list: Array<History & Entity> | undefined = undefined
type ChangeListener = (list: Array<History & Entity>) => void
const changeListeners: ChangeListener[] = []

export async function listHistory(): Promise<Array<History & Entity>> {
  if (_list) {
    return _list
  }
  const store = await getStore()
  _list = await store.findAll()
  return _list
}

export async function addHistory(history: History): Promise<void> {
  const list = await listHistory()
  const store = await getStore()
  // 最多只存 1000 条
  const count = list.length
  // 从前面删除多余的
  if (count > 1000) {
    for (let i = 0; i < count - 1000; i++) {
      const his = list.shift()
      if (his) {
        await store.deleteById(his.id)
      }
    }
  }
  // 清理掉参数中的 blob 对象，历史记录不存储文件信息，
  // 从 vue 组件传入的对象有可能是响应式的，需要设法进行复制，不产生副作用
  const filnalParameters = history.parameters.map(param => {
    const res = Object.assign({}, param)
    res.file = undefined
    return res
  })
  const data = deepClone(Object.assign({}, history, { parameters: filnalParameters }))
  const id = await store.create(data)
  list.push(Object.assign({}, data, { id }))
  triggerChangeEvent()
}

export async function removeHistory(id: number): Promise<void> {
  const list = await listHistory()
  const idx = list.findIndex(his => his.id === id)
  if (idx === -1) {
    return
  }
  list.splice(idx, 1)
  const store = await getStore()
  await store.deleteById(id)
  triggerChangeEvent()
}

export async function clearHistory(): Promise<void> {
  const store = await getStore()
  _list = []
  await store.clear()
  triggerChangeEvent()
}

function triggerChangeEvent(): void {
  if (!_list) {
    return
  }
  const list = _list
  for (const listener of changeListeners) {
    setTimeout(() => {
      listener(list)
    }, 0)
  }
}

export function onHistoryChange(listener: ChangeListener): void {
  changeListeners.push(listener)
}

export function offHistoryChange(listener: ChangeListener): void {
  const idx = changeListeners.indexOf(listener)
  if (idx !== -1) {
    changeListeners.splice(idx, 1)
  }
}
