// indexedDB 的简单封装，由于 indexedDB 只能在版本变动时才可以创建 store，不是很灵活
// 这里为每个表者创建一个库，舍弃了事务、二级索引相关特性，大幅度降低了操作的复杂性，同时也牺牲了非常多的功能
// 项目中仅仅是存储数据，要求不高，也够用了

import { deepClone } from './object'

export interface Entity {
  id: number
}

/**
 * 数据存储对象.
 */
interface DbStore<T> {
  /**
   * 创建
   * @param data
   */
  create(data: T): Promise<number>
  /**
   * 更新
   * @param id
   * @param data
   */
  update(id: number, data: T): Promise<boolean>
  /**
   * 获取所有
   */
  findAll(): Promise<Array<T & Entity>>
  /**
   * 获取单条记录
   * @param id
   */
  findById(id: number): Promise<(T & Entity) | undefined>
  /**
   * 判定id是否存在
   * @param id
   */
  existsById(id: number): Promise<boolean>
  /**
   * 删除指定记录.
   * @param id
   */
  deleteById(id: number): Promise<void>
  /**
   * 查询id大于某个数值的记录,用于翻页查询.
   * @param minId
   * @param limit
   */
  findByIdGreaterThan(minId: number, limit?: number): Promise<Array<T & Entity>>
  /**
   * 获取记录总数.
   */
  count(): Promise<number>
  /**
   * 清除所有记录.
   */
  clear(): Promise<void>
}

class DbStoreImpl<T> implements DbStore<T> {
  private readonly db: IDBDatabase
  private readonly storeName: string
  constructor(db: IDBDatabase, storeName: string) {
    this.db = db
    this.storeName = storeName
  }
  clear(): Promise<void> {
    return this.wrapRequest(this.getStore().clear())
  }

  private getStore(): IDBObjectStore {
    const tx = this.db.transaction([this.storeName], 'readwrite')
    return tx.objectStore(this.storeName)
  }

  private wrapRequest<R>(request: IDBRequest<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      request.onerror = event => {
        reject(`操作失败` + event.type)
        console.error('操作失败', request, event)
      }
      request.onsuccess = () => resolve(request.result)
    })
  }

  async existsById(id: number): Promise<boolean> {
    const res = await this.wrapRequest(this.getStore().getKey(id))
    return !!res
  }

  async create(data: T): Promise<number> {
    // data 必须深度克隆，从 vue 组件传过来的对象有可能是 proxy 对象，indexed 本身要做克隆再存储的，proxy 不能克隆，报错
    // update 方法也是一样，做做深度克隆
    const id = (await this.wrapRequest(this.getStore().add(deepClone(data)))) as number
    return id
  }

  async update(id: number, data: T): Promise<boolean> {
    if (!(await this.existsById(id))) {
      return false
    }
    await this.wrapRequest(this.getStore().put(deepClone(data), id))
    return true
  }

  findAll(): Promise<(T & Entity)[]> {
    return this.wrapRequest(this.getStore().getAll())
  }

  findById(id: number): Promise<(T & Entity) | undefined> {
    return this.wrapRequest(this.getStore().get(id))
  }
  deleteById(id: number): Promise<void> {
    return this.wrapRequest(this.getStore().delete(id))
  }
  findByIdGreaterThan(minId: number, limit?: number): Promise<(T & Entity)[]> {
    return this.wrapRequest(this.getStore().getAll(IDBKeyRange.lowerBound(minId, true), limit))
  }
  count(): Promise<number> {
    return this.wrapRequest(this.getStore().count())
  }
}

export function openDbStore<T>(tableName: string): Promise<DbStore<T>> {
  return new Promise<DbStore<T>>((resolve, reject) => {
    const request = indexedDB.open(tableName, 1)
    request.onerror = event => reject(event)
    request.onupgradeneeded = () => {
      try {
        const db = request.result
        db.createObjectStore(tableName, {
          autoIncrement: true,
          keyPath: 'id'
        })
      } catch (e) {
        reject(e)
      }
    }
    request.onsuccess = () => {
      const db = request.result
      // 创建 store
      resolve(new DbStoreImpl(db, tableName))
    }
  })
}
