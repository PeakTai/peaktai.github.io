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
    rootComponentPath: '@/pages/blogs/Java15Features.vue',
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
    rootComponentPath: '@/pages/blogs/Java14Features.vue',
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
    rootComponentPath: '@/pages/blogs/Css3Pie.vue',
    createAt: new Date('2022/01/15')
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
