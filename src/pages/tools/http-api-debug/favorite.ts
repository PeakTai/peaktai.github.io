// 收藏

import { openDbStore } from '@/utils/indexed-db'

interface Favorite {}

const storePromise = openDbStore<Favorite>('http-api-debug-favorite')

/**
 * 添加到收藏.
 */
export async function addToFavorite(favorite: Favorite): Promise<void> {
  const store = await storePromise
  store.create(favorite)
}

export async function listFavorite(): Promise<Favorite[]> {
  const store = await storePromise
  return (await store.findAll()).reverse()
}
