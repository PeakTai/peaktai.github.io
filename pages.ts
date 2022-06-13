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
  title: string;
  /**
   * 描述信息，会放入 meta description 中.
   */
  desc: string;
  /**
   * 关键字.
   */
  tags?: string[];
  /**
   * 页面根组件（.vue文件）的位置.
   */
  rootComponentPath: string;
  /**
   * 不可搜索，值为 true 则表示不出会现在全站搜索中.
   */
  notSearchable?: boolean
  /**
   * 创建时间,对于有些页面是必须的,如文章.
   */
  createAt?: Date,
  /**
   * 封面地址
   */
  coverUrl?: string
}

/**
 * 网站所有页面信息.脚本将根据这个信息完成站点的构建，并且也用于全站搜索.
 */
export const pages: Page[] = [
  {
    id: 'index',
    category: 'blog',
    title: '首页',
    desc: '',
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
    desc: '关于 peak 的个人网站”有限循环“',
    tags: ['blogs', '博客', 'peaktai', '个人网站', 'personal-site', '有限循环'],
    rootComponentPath: '@/pages/About.vue',
    notSearchable: true
  },
  {
    id: 'search',
    title: '搜索',
    category: 'search',
    desc: `搜索 peak 的个人网站“步入循环”内的所有页面`,
    tags: ['blogs', '博客', 'peaktai', '个人网站', 'personal'],
    rootComponentPath: '@/pages/Search.vue',
    notSearchable: true
  },
  {
    id: 'tools',
    title: '在线小工具',
    category: 'tool',
    desc: '一些开发相关的在线小工具，步骤计算器等',
    tags: ['在线工具'],
    rootComponentPath: '@/pages/tools/Index.vue',
    notSearchable: true,
  },
  {
    id: 'tools/calculator',
    title: '财务计算器',
    category: 'tool',
    desc: '自己平常做报销单用的，方便的一次运算然后转换金额大写，支持历史记录，' +
      '可查看计算步骤，支持百分比数字，可配置舍入模式和精度，计算本身没有限制，'
      + '对于不适合转换成金额的结果无法使用转换功能',
    tags: ['财务', '计算器', '大小写转换', '计算步骤演示'],
    rootComponentPath: '@/pages/tools/calculator/Index.vue'
  },
  {
    id: 'tools/binary-viewer',
    title: '文件二进制查看器',
    category: 'tool',
    desc: '以二制进的形式呈现文件内容，支持查看字节对应的ASCII码和十六进制，对设备有较高要求，' +
      '大文件可能会造成严重卡顿,硬件较差的设备可通过选项减少显示内容',
    tags: ['binary', 'viewer', '二进制查看'],
    rootComponentPath: '@/pages/tools/binary-viewer/Index.vue'
  },
  {
    id: 'tools/browser-info',
    title: "浏览器信息",
    category: 'tool',
    desc: '查看浏览器信息,分辨率、网络状态、电量信息、可用内存、检测一些浏览器实验性功能是否可用',
    rootComponentPath: '@/pages/tools/BrowserInfo.vue'
  },
  {
    id: 'tools/color-picker',
    category: 'tool',
    title: '图片拾色器',
    desc: '拾取图片中的颜色，显示 HTML（十六进制） 和 RGBA 两种格式的颜色值',
    rootComponentPath: '@/pages/tools/ColorPicker.vue'
  },
  {
    id: 'tools/http-api-debug',
    category: 'tool',
    title: 'HTTP API 调试',
    desc: ` 一个简易的后端接口调试工具，需要后端做好 CORS 设置，基于FETCH API实现，
    支持收藏夹和历史记录，但是不提供任何后端存储服务，所有的数据仅存储在本地（localStorage），数据不能多设备间互通，如果想转移数据，可以将记录导出为文件，
      然后在别的设备上将文件导入`,
    rootComponentPath: '@/pages/tools/http-api-debug/Index.vue'
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
  {
    id: 'blogs/java15',
    title: 'Java15的主要更新内容',
    category: 'blog',
    desc: 'CharSequence 增加 isEmpty 默认方法，支持 unicode 13，增加隐藏类，' +
      'TreeMap 优化，JMX 配置增强，windows 版本免去环境变量配置，废弃偏向锁，弱算法警告，' +
      'krb5.conf 支持 canonicalize，增加新的系统属性用于配置 TLS 签名模式 ',
    tags: ['java', '隐藏类'],
    rootComponentPath: '@/pages/blogs/2022/Java15Features.vue',
    createAt: new Date('2022/05/18')
  },
  {
    id: 'blogs/java14-features',
    title: 'Java14的主要更新内容',
    category: 'blog',
    desc: '引入了 record 语法，可以非常简单方便的申明一个装载有不可变数据的类，支持会计风格货币格式化，' +
      '删除部分废弃的线程方法，ZGC 支持 Windows 和 Mac os，G1 支持 NUMA-Aware 内存分配，' +
      'Parallel GC 优化，JFR 支持事件消费可用于记录进程外的记录',
    tags: ['java', 'record', 'gc', '线程'],
    rootComponentPath: '@/pages/blogs/2022/Java14Features.vue',
    createAt: new Date('2022/04/16')
  },
  {
    id: 'blogs/css3-pie',
    title: '用 css3 实现饼图',
    category: 'blog',
    desc: '开发中常常有做统计图的需求，主流的前端插件都是基于 canvas 来做的，' +
      '使用 css3 的渐变背景或路径裁切也一样可以实现同样的效果，渐变背景可以实现较为简单的基础效果，' +
      '路径裁切则能够实现比较强大的交互效果，只是路径裁切兼容性目前不是太好',
    tags: ['css3', '前端', '饼图', '统计图'],
    rootComponentPath: '@/pages/blogs/2022/Css3Pie.vue',
    createAt: new Date('2022/01/15')
  },
  {
    id: 'blogs/my-views-on-mini-program',
    title: '我对小程序的一些看法',
    category: 'blog',
    desc: '小程序自从出来之后就挺火的，到目前为止小程序的数量已经非常可观了，' +
      '各个平台都推出了自己的小程序。那么，如果要做一个新项目，我们是否应该考虑开发小程序呢？' +
      '或者，已有的项目有没有必要改造成小程序？',
    tags: ['微信', '小程序', 'html5', '跨平台开发', 'pwa'],
    rootComponentPath: '@/pages/blogs/2022/MyViewsOnMiniProgram.vue',
    createAt: new Date('2022/01/03')
  },
  {
    id: 'blogs/java-bio-nio-aio',
    title: '几段代码感受 java 中的 bio、nio和aio',
    category: 'blog',
    desc: '网上经常看到关于同步和阻塞相关的推送或推荐，解释四种组合。很长一段时间我也搞不明白这些概念，但是似乎也对工作没有任何影响，带着这样的疑问，查阅了很多资料。网上有很多文章都是各种打比方，像排队买饭或是打电话预约等之类的，看了之后感觉更懵了，这里我使用 java 代码直观的展示各种模式。',
    tags: ['java', 'bio', 'nio', 'aio'],
    rootComponentPath: '@/pages/blogs/2022/java-bio-nio-aio/Index.vue',
    createAt: new Date('2022/06/09')
  },
  {
    id: 'blogs/vue3-array-not-reactive',
    title: '记一次 vue3 数组不响应问题的排查',
    category: 'blog',
    desc: '最近在编程时，遇到了 vue3 数组更新却没有响应的问题，解决后，决定把这次的问题总结下，然后记录下来',
    tags: ['vue3', '前端'],
    rootComponentPath: '@/pages/blogs/2022/vue3-array-not-reactive/Index.vue',
    createAt: new Date('2022/06/12')
  },
  {
    id: 'blogs/query-count',
    title: '分页查询的 count 问题',
    category: 'blog',
    desc: 'Web应用的业务中常常会有分页查询的功能，让用户可以直观的看到匹配记录的数量，自由跳页快速翻看后面的数据。但是分页查询在数据量大和并发量较大时，往往会有比较严重的性能问题，' +
      '分页查询一般会使用 select count(*) 求总数，offset 实现跳页，问题常常出在这里',
    tags: ['sql', '数据库'],
    rootComponentPath: '@/pages/blogs/2022/QueryCount.vue',
    createAt: new Date('2022/01/02')
  },
  {
    id: 'blogs/improve-the-efficiency-of-small-teams',
    title: '小型开发团队如何提高生产力',
    category: 'blog',
    desc: '对于小规模的技术团队，人力有限却有众多繁杂的事情要处理，怎么样更有效的利用资源，提高开发效率呢？这篇文章我分享一些自己的看法。',
    rootComponentPath: '@/pages/blogs/2022/ImproveTheEfficiencyOfSmallTeams.vue',
    createAt: new Date('2022/01/16')
  },
  {
    id: 'blogs/wechat-moments-dbd',
    title: '类似微信朋友圈业务的数据库表结构设计',
    category: 'blog',
    tags: ['微信', '数据库'],
    desc: '今天聊一下类似微信朋友圈这样的业务该怎么设计数据库的表结构，纯个人观点，希望能够提供一点参考价值',
    rootComponentPath: '@/pages/blogs/2022/WechatMomentsDbd.vue',
    createAt: new Date('2022/02/13')
  }
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
