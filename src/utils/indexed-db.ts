// indexedDB 的简单封装，由于 indexedDB 只能在版本变动时才可以创建 store，不是很灵活
// 这里为每个表者创建一个库，舍弃了事务、二级索引相关特性，大幅度降低了操作的复杂性，同时也牺牲了非常多的功能

export interface Entity {
  id: number
}

const customIdDbStoreMap = new Map<string, CustomIdDbStore<any>>()

export function getOrCreateCustomIdDbStore<T>(tableName: string): Promise<CustomIdDbStore<T>> {
  const existingStore = customIdDbStoreMap.get(tableName)
  if (existingStore) {
    return Promise.resolve(existingStore)
  }
  return new Promise<CustomIdDbStore<T>>(function (resolve, reject) {
    const request = indexedDB.open(tableName, 1)
    request.onerror = event => reject(event)
    request.onupgradeneeded = () => {
      try {
        const db = request.result
        db.createObjectStore(tableName, {
          autoIncrement: false
        })
      } catch (e) {
        reject(e)
      }
    }
    request.onsuccess = () => {
      const db = request.result
      const store = new CustomIdDbStore<T>(db, tableName)
      customIdDbStoreMap.set(tableName, store)
      resolve(store)
    }
  })
}

export class DbStoreBase<T> {
  private readonly db: IDBDatabase
  private readonly storeName: string
  constructor(db: IDBDatabase, tableName: string) {
    this.db = db
    this.storeName = tableName
  }

  protected getStore(): IDBObjectStore {
    const tx = this.db.transaction([this.storeName], 'readwrite')
    return tx.objectStore(this.storeName)
  }

  protected wrapRequest<R>(request: IDBRequest<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      request.onerror = event => {
        reject(`操作失败` + event.type)
        console.error('操作失败', request, event)
      }
      request.onsuccess = () => resolve(request.result)
    })
  }
}

export class CustomIdDbStore<T> extends DbStoreBase<T> {
  constructor(db: IDBDatabase, tableName: string) {
    super(db, tableName)
  }

  async upsert(id: string, data: T): Promise<boolean> {
    await this.wrapRequest(this.getStore().put(data, id))
    return true
  }

  async existsById(id: string): Promise<boolean> {
    const res = await this.wrapRequest(this.getStore().getKey(id))
    return !!res
  }

  async findById(id: string): Promise<T> {
    return await this.wrapRequest(this.getStore().get(id))
  }

  findByIdGreaterThan(minId: string, limit?: number): Promise<T[]> {
    return this.wrapRequest(this.getStore().getAll(IDBKeyRange.lowerBound(minId, true), limit))
  }

  count(): Promise<number> {
    return this.wrapRequest(this.getStore().count())
  }

  async clear(): Promise<void> {
    await this.wrapRequest(this.getStore().clear())
  }

  async findAll(): Promise<Array<T & Entity>> {
    return await this.wrapRequest(this.getStore().getAll())
  }

  async deleteById(id: string): Promise<void> {
    return this.wrapRequest(this.getStore().delete(id))
  }
}

const dbStoreMap = new Map<string, DbStore<any>>()

export function getOrCreateDbStore<T>(tableName: string): Promise<DbStore<T>> {
  const existingStore = dbStoreMap.get(tableName)
  if (existingStore) {
    return Promise.resolve(existingStore)
  }
  return new Promise<DbStore<T>>(function (resolve, reject) {
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
      const store = new DbStore<T>(db, tableName)
      dbStoreMap.set(tableName, store)
      resolve(store)
    }
  })
}

export class DbStore<T> extends DbStoreBase<T> {
  constructor(db: IDBDatabase, tableName: string) {
    super(db, tableName)
  }

  async create(data: T): Promise<number> {
    const id = (await this.wrapRequest(this.getStore().add(data))) as number
    return id
  }

  async existsById(id: number): Promise<boolean> {
    const res = await this.wrapRequest(this.getStore().getKey(id))
    return !!res
  }

  async findById(id: number): Promise<T> {
    return await this.wrapRequest(this.getStore().get(id))
  }

  findByIdGreaterThan(minId: number, limit?: number): Promise<T[]> {
    return this.wrapRequest(this.getStore().getAll(IDBKeyRange.lowerBound(minId, true), limit))
  }

  count(): Promise<number> {
    return this.wrapRequest(this.getStore().count())
  }

  async findAll(): Promise<Array<T & Entity>> {
    return await this.wrapRequest(this.getStore().getAll())
  }

  async deleteById(id: number): Promise<void> {
    return this.wrapRequest(this.getStore().delete(id))
  }

  async clear(): Promise<void> {
    await this.wrapRequest(this.getStore().clear())
  }
}
