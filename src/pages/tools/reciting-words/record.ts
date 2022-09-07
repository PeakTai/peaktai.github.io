import { CustomIdDbStore, getOrCreateCustomIdDbStore } from '../../../utils/indexed-db'

export interface WordLearning {
  word: string
  mastered: boolean
  /**
   * 背单词时，通过测试时间.
   */
  passedAt?: number
}

function getStore(): Promise<CustomIdDbStore<WordLearning>> {
  return getOrCreateCustomIdDbStore<WordLearning>('tools-reciting-words-word-learning')
}

export async function getAllWordLearnings(): Promise<WordLearning[]> {
  const store = await getStore()
  return store.findAll()
}

export async function saveWordAsMastered(word: string): Promise<void> {
  const store = await getStore()
  await store.upsert(word, { word, mastered: true })
}

export async function saveWordAsPassed(word: string): Promise<void> {
  const store = await getStore()
  await store.upsert(word, { word, mastered: false, passedAt: new Date().getTime() })
}
