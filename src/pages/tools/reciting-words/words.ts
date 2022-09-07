import { compareTwoStrings } from 'string-similarity'

let words: string[] = []

export async function getAllWords(): Promise<string[]> {
  if (words && words.length) {
    return words
  }
  const resp = await fetch('/assets/tools/reciting-words/words.txt')
  const text = await resp.text()
  words = text.split(/\r?\n/).filter(w => !!w)
  return words
}
/**
 * 找出与指定单词相似的单词，最多返回5个.
 * @param word
 */
export async function findSimilarWords(word: string): Promise<string[]> {
  const allWrods = await getAllWords()
  return (
    allWrods
      // 过滤掉长度相差过大以及自身
      .filter(w => {
        if (w === word) {
          return false
        }
        if (Math.abs(w.length - word.length) > 3) {
          return false
        }
        return true
      })
      // 获取相似度信息，然后排序，相似度大的排前面
      .map(w => ({
        similarity: compareTwoStrings(word, w),
        word: w
      }))
      .sort((o1, o2) => {
        return o2.similarity - o1.similarity
      })
      // 只要前5个
      .slice(0, 5)
      .map(w => w.word)
  )
}
/**
 * 找出几个频率相近的词，最多返回10个.
 * @param word
 */
export async function findWordsWithSimilarFrequency(word: string): Promise<string[]> {
  const allWords = await getAllWords()
  const index = allWords.findIndex(w => w === word)
  if (index === -1) {
    return []
  }
  let endIndex = index + 5
  if (endIndex > allWords.length) {
    endIndex = allWords.length
  }
  let startIndex = endIndex - 10
  if (startIndex < 0) {
    startIndex = 0
  }
  return allWords.slice(startIndex, endIndex)
}
