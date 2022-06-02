import { Page } from './../../pages';

/**
 * 匹配结果，字段都是 html ，匹配成功的关键字部分用 em 标签包裹.
 *
 */
export interface PageMatchResult {
  title: string
  tags: string
  desc: string
  originalPage: Page
  /**
   * 整体关键字出现的次数.
   */
  wholeOccurrence: number
  /**
   * 被匹配到的单词数量.
   */
  matchedWordsCount: number
  /**
   * 所有的词一共出现次数.
   */
  wordsOccurrence: number
}
/**
 * 片段，匹配过程中产生.
 */
interface Fragment {
  /**
   * 是否是高亮部分，如果为 true ，则不能进行再次匹配.
   */
  highlight: boolean
  content: string
}

const encodeDiv = document.createElement('div')
function encodeHtml(html: string): string {
  encodeDiv.innerText = html
  return encodeDiv.innerHTML
}

export function buildBlankMatchResult(page: Page): PageMatchResult {
  return {
    title: encodeHtml(page.title),
    desc: encodeHtml(page.desc),
    tags: encodeHtml(page.tags ? page.tags.join(' , ') : ''),
    originalPage: page,
    wholeOccurrence: 0,
    matchedWordsCount: 0,
    wordsOccurrence: 0
  }
}

/**
 * 匹配页面.
 * @param page
 * @param keyword
 */
export function matchPage(page: Page, keyword: string): PageMatchResult {
  // 空串直接返回原始信息
  if (!keyword.trim()) {
    return buildBlankMatchResult(page)
  }
  let words = keyword.split(/\s+/).filter(w => !!w)
  // 关键字除了要保证不重复，还不能有相互包含的关系，否则只保存长的，因为长的更准确
  // 比如关键字是”Hello He“，将会得到两个词：Hello 和 He,而 Hello 是包含 He 的
  words = words.sort((w1, w2) => {
    return w2.length - w1.length
  })
  const finalWords: string[] = []
  words.forEach(word => {
    const existed = finalWords.some(finalWord => finalWord.indexOf(word) !== -1)
    if (existed) {
      return
    }
    finalWords.push(word)
  })
  if (!finalWords.length) {
    return buildBlankMatchResult(page)
  }

  const originalTags = page.tags ? page.tags.join(' , ') : ''
  // 整个关键字匹配
  const titleMatchResult = matchContent(page.title, keyword)
  const descMatchResult = matchContent(page.desc, keyword)
  const tagsMatchResult = matchContent(originalTags, keyword)
  const wholeOccurrence = titleMatchResult.occurrence + descMatchResult.occurrence + tagsMatchResult.occurrence
  // 拆解，再拆解，两层拆解
  let matchedWordsCount = 0
  let wordsOccurrence = 0
  let titleFrags = titleMatchResult.frags
  let descFrags = descMatchResult.frags
  let tagsFrags = tagsMatchResult.frags
  words.forEach(word => {
    let occurrence = 0
    titleFrags = titleFrags.flatMap(frag => {
      if (frag.highlight) {
        return [frag]
      }
      const result = matchContent(frag.content, word)
      occurrence += result.occurrence
      return result.frags
    })
    descFrags = descFrags.flatMap(frag => {
      if (frag.highlight) {
        return [frag]
      }
      const result = matchContent(frag.content, word)
      occurrence += result.occurrence
      return result.frags
    })
    tagsFrags = tagsFrags.flatMap(frag => {
      if (frag.highlight) {
        return [frag]
      }
      const result = matchContent(frag.content, word)
      occurrence += result.occurrence
      return result.frags
    })
    if (occurrence > 0) {
      matchedWordsCount++
    }
    wordsOccurrence += occurrence
  })
  // 生成新的 html
  const title = titleFrags.map(frag => {
    if (!frag.highlight) {
      frag.content = encodeHtml(frag.content)
    }
    return frag.content
  }).join('')
  const desc = descFrags.map(frag => {
    if (!frag.highlight) {
      frag.content = encodeHtml(frag.content)
    }
    return frag.content
  }).join('')
  const tags = tagsFrags.map(frag => {
    if (!frag.highlight) {
      frag.content = encodeHtml(frag.content)
    }
    return frag.content
  }).join('')
  return {
    title, desc, tags, originalPage: page, wholeOccurrence, matchedWordsCount, wordsOccurrence
  }
}

function matchContent(content: string, word: string): { occurrence: number, frags: Fragment[] } {
  // 转义word 中的正则字符，然后使用正则拆分，实现忽略大小写匹配
  const escapeRegExp = /(\$|\(|\)|\*|\+|\.|\[|\]|\?|,|\^|\{|\}|\|)/g
  const escapedWord = word.replace(escapeRegExp, (s) => '\\' + s)
  const wordRegExp = new RegExp(escapedWord, 'gi')
  const splits = content.split(wordRegExp)
  const occurrence = splits.length - 1
  if (occurrence === 0) {
    return { occurrence, frags: [{ highlight: false, content }] }
  }
  // 最后贵的内容得使用原内容，而不能是 word
  // 比如 java 匹配了 JAVA，最后显示还得是 JAVA，而不能是 java
  let originalWord = ''
  content.replace(new RegExp(escapedWord, 'i'), (s) => {
    originalWord = s
    return s
  })

  const frags: Fragment[] = []
  splits.forEach((item, index) => {
    if (index !== 0) {
      frags.push({
        highlight: true,
        content: `<mark>${encodeHtml(originalWord)}</mark>`
      })
    }
    frags.push({
      highlight: false,
      content: item
    })
  })
  return { occurrence, frags }
}


/**
 * 匹配给定的页面列表，没有匹配成功的不会出现在结果中.
 * @param pages
 * @param keyword 关键字，关键字为空的情况下匹配不到任何内容，所以确保在关键字有内容的情况下调用.
 * @returns
 */
export function matchPages(pages: Page[], keyword: string): PageMatchResult[] {
  return pages.map(page => matchPage(page, keyword))
    .filter(result => result.wholeOccurrence > 0 || result.matchedWordsCount > 0 || result.wordsOccurrence > 0)
    .sort((p1, p2) => {
      // 按匹配度排序
      const wholeDiff = p2.wholeOccurrence - p1.wholeOccurrence
      if (wholeDiff !== 0) {
        return wholeDiff
      }
      const matchedWordsDiff = p2.matchedWordsCount - p1.matchedWordsCount
      if (matchedWordsDiff !== 0) {
        return matchedWordsDiff
      }
      const wordsOccurrenceDiff = p2.wordsOccurrence - p1.wordsOccurrence
      if (wordsOccurrenceDiff !== 0) {
        return wordsOccurrenceDiff
      }
      // 接下来，可以比时间
      const time1 = p1.originalPage.createAt ? p1.originalPage.createAt.getTime() : 0
      const time2 = p2.originalPage.createAt ? p2.originalPage.createAt.getTime() : 0
      const timeDiff = time2 - time1
      if (timeDiff !== 0) {
        return timeDiff
      }
      // 最后比 id 吧，id 是唯一的
      return p2.originalPage.id.localeCompare(p1.originalPage.id)
    })
}
