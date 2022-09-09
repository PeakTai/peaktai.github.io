import { blog2022Pages } from './blogs-2022'
import { Page } from './page'
import { toolPages } from './tools'

export * from './page'

/**
 * 网站所有页面信息.脚本将根据这个信息完成站点的构建，并且也用于全站搜索.
 */
export const pages: Page[] = [
  {
    id: 'index',
    category: 'blog',
    title: '首页',
    desc: 'peak 的个人网站步入循环，里面有个人的博客文章，一些在线工具，以及写过的部分代码',
    tags: ['blogs', '博客', 'peaktai', '个人网站', 'personal'],
    rootComponentPath: '@/pages/Index.vue',
    notSearchable: true
  },
  {
    id: '404',
    title: '404 not found',
    desc: '抱歉，未找到您想要的页面',
    tags: ['404', 'not found', '页面不存在'],
    rootComponentPath: '@/pages/NotFound.vue',
    notSearchable: true
  },
  {
    id: 'about',
    title: '关于本站',
    category: 'about',
    desc: '关于 peak 的个人网站步入循环',
    tags: ['blogs', '博客', 'peaktai', '个人网站', 'personal-site', '步入循环'],
    rootComponentPath: '@/pages/About.vue',
    notSearchable: true
  },
  {
    id: 'search',
    title: '搜索',
    category: 'search',
    desc: `搜索 peak 的个人网站步入循环内的所有页面`,
    tags: ['blogs', '博客', 'peaktai', '个人网站', 'personal'],
    rootComponentPath: '@/pages/Search.vue',
    notSearchable: true
  },
  {
    id: 'tools',
    title: '在线小工具',
    category: 'tool',
    desc:
      '主要是一些为自己做的开发工具用于辅助编程，还有其它一些工作和生活中会用到的小工具。 ' +
      '也没有什么太多的新东西，很多功能装几个软件就有了，' +
      '之所以自己又做了一套，是想用的趁手些， 精简掉不需要的功能，更符合自己的需求和习惯。',
    tags: ['在线工具'],
    rootComponentPath: '@/pages/tools/Index.vue',
    notSearchable: true
  },
  {
    id: 'demos',
    title: '在线演示',
    category: 'demo',
    desc: '前端在线演示',
    tags: ['在线演示'],
    rootComponentPath: '@/pages/demos/Index.vue',
    notSearchable: true
  },
  ...blog2022Pages,
  ...toolPages
]

/**
 * 获取当前地址对应的页面信息.
 */
export function getCurrentPage(): Page | undefined {
  // 根据路径，找到当前的页面信息
  let path = location.pathname
  if (path === '/') {
    path = 'index'
  } else if (!path.endsWith('.html')) {
    path = `${path}/index`
  } else {
    path = path.substring(0, path.length - 5)
  }
  if (path.startsWith('/')) {
    path = path.substring(1)
  }
  return pages.find(page => page.id === path)
}
