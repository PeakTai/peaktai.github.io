export function getTopRelativeToBody(el: HTMLElement) {
  let top = 0
  let offsetEl: Element | null = el
  while (offsetEl && offsetEl instanceof HTMLElement) {
    top += offsetEl.offsetTop + offsetEl.clientTop
    offsetEl = offsetEl.offsetParent
  }
  return top
}

export interface Directory {
  name: string
  el: HTMLElement
  subdirectories?: Directory[]
}

/**
 * 检测文章中的目录结构.
 * 文章的标题是 h1,文章内容中的一级标题是 h3,二级标题是 h4，仅支持两级，h2 太大了，不太美观
 */
export function detectDirectories(container: HTMLElement): Directory[] {
  const headers = container.querySelectorAll('h3,h4')
  const directories: Directory[] = []
  let directory: Directory | null = null
  headers.forEach(el => {
    const htmlEL = el as HTMLElement
    const tagName = htmlEL.tagName.toLowerCase()
    if (tagName === 'h3') {
      directory = { name: htmlEL.innerText, el: htmlEL }
      directories.push(directory)
    }
    if (tagName === 'h4' && directory) {
      if (!directory.subdirectories) {
        directory.subdirectories = []
      }
      directory.subdirectories.push({ name: htmlEL.innerText, el: htmlEL })
    }
  })
  return directories
}
