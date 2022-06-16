export type PageCategory = 'blog' | 'tool' | 'demo' | 'search' | 'about'

/**
 * 页面信息.
 */
export interface Page {
  /**
   * id，和最终生成的页面路径有关. 配置文件中的 key.
   */
  id: string
  /**
   * 页面类别.
   */
  category?: PageCategory
  /**
   * 标题，会放入页面的 title 标签中.
   */
  title: string
  /**
   * 描述信息，会放入 meta description 中.
   */
  desc: string
  /**
   * 关键字.
   */
  tags?: string[]
  /**
   * 页面根组件（.vue文件）的位置，
   * 现已支持 markdown，会自动将 markdown 转成 vue 组件.
   */
  rootComponentPath: string
  /**
   * 不可搜索，值为 true 则表示不出会现在全站搜索中.
   */
  notSearchable?: boolean
  /**
   * 创建时间,对于有些页面是必须的,如文章.
   */
  createAt?: Date
  /**
   * 封面地址
   */
  coverUrl?: string
}
