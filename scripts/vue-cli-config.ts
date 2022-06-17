/// <reference types="node" />
import fs from 'fs'
import path from 'path'
import { pages } from './../src/config'

export function generateVueCliConfig(workDir: string): string {
  // multi pages
  const pagesConfig: any = {}
  pages.forEach(page => {
    const entryPath = path.join(workDir, 'build', `${page.id}.ts`)
    const entryDir = path.parse(entryPath).dir
    if (!fs.existsSync(entryDir)) {
      fs.mkdirSync(entryDir, { recursive: true })
    }
    pagesConfig[page.id] = {
      entry: `build/${page.id}.ts`,
      title: `${page.title}-步入循环`,
      description: page.desc,
      keywords: page.tags ? page.tags.join(',') : ''
    }
  })
  return JSON.stringify(pagesConfig)
}
