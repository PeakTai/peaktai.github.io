/// <reference types="node" />

import { pages } from './../src/config'
import * as path from 'path'
import * as fs from 'fs'
import { generateEntryTs } from './vue-cli-entry'
import { generateVueCliConfig } from './vue-cli-config'

const workDir = path.join(__dirname, '..')
const buildDir = path.join(workDir, 'build')
if (fs.existsSync(buildDir)) {
  fs.rmdirSync(buildDir, { recursive: true })
}
fs.mkdirSync(buildDir)
console.log(`工作目录：${workDir}`)
console.log(`生成的构建文件所在目录：${buildDir}`)

// 将页面 id 存储起来用于判定是否存在重复 id，如果有重复，后面的流程会有问题
// 有可能页面加多了，会不小心把id写重复了，要防止出现这种情况
const idSet = new Set<string>()

// 生成各个页面的入口文件
pages.forEach(page => {
  if (idSet.has(page.id)) {
    throw new Error(`页面ID重复：${page.id}`)
  }
  idSet.add(page.id)
  const entryPath = path.join(buildDir, `${page.id}.ts`)
  console.log(`开始生成文件：${entryPath}`)
  const entryDir = path.parse(entryPath).dir
  if (!fs.existsSync(entryDir)) {
    fs.mkdirSync(entryDir, { recursive: true })
  }
  fs.writeFileSync(entryPath, generateEntryTs(page))
})

// 生成 vue cli 配置文件
const vueCliConfigPath = path.join(workDir, 'vue.config.pages.json')
console.log(`开始生成文件：${vueCliConfigPath}`)
fs.writeFileSync(vueCliConfigPath, generateVueCliConfig(workDir))

console.log('页面配置文件生成完毕！')
