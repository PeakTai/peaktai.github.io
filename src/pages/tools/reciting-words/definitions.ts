/**
 * 为了减少单文件的尺寸，提升加载速度，单词释义信息分布在 100 个文件中。
 */

import { getAllWords } from './words'

export interface Definition {
  word: string
  pron: string
  defs: Array<{ pos: string; trans: string }>
}

const shardMap = new Map<number, Definition[]>()

async function loadShard(shardIndex: number): Promise<Definition[]> {
  const existingShard = shardMap.get(shardIndex)
  if (existingShard) {
    return existingShard
  }
  const resp = await fetch(`/assets/tools/reciting-words/defs/${shardIndex}.json`)
  const shard = await resp.json()
  shardMap.set(shardIndex, shard)
  return shard
}

export async function getDefinition(word: string): Promise<Definition | undefined> {
  const words = await getAllWords()
  const idx = words.indexOf(word)
  if (idx === -1) {
    return undefined
  }
  const shardIndex = Math.floor(idx / 100)
  const defs = await loadShard(shardIndex)
  if (!defs || !defs.length) {
    return undefined
  }
  return defs.find(item => item.word === word)
}
