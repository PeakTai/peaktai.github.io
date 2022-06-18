import { Page } from './page'

export const blog2022Pages: Page[] = [
  {
    id: 'blogs/2022/java15-features',
    title: 'Java 15 的主要更新内容',
    category: 'blog',
    desc:
      'CharSequence 增加 isEmpty 默认方法，支持 unicode 13，增加隐藏类，' +
      'TreeMap 优化，JMX 配置增强，windows 版本免去环境变量配置，废弃偏向锁，弱算法警告，' +
      'krb5.conf 支持 canonicalize，增加新的系统属性用于配置 TLS 签名模式 ',
    tags: ['java', '隐藏类'],
    rootComponentPath: '@/pages/blogs/2022/java-15-features.md',
    createAt: new Date('2022/05/18')
  },
  {
    id: 'blogs/2022/java14-features',
    title: 'Java 14 的主要更新内容',
    category: 'blog',
    desc:
      '引入了 record 语法，可以非常简单方便的申明一个装载有不可变数据的类，支持会计风格货币格式化，' +
      '删除部分废弃的线程方法，ZGC 支持 Windows 和 Mac os，G1 支持 NUMA-Aware 内存分配，' +
      'Parallel GC 优化，JFR 支持事件消费可用于记录进程外的记录',
    tags: ['java', 'record', 'gc', '线程'],
    rootComponentPath: '@/pages/blogs/2022/java-14-features.md',
    createAt: new Date('2022/04/15')
  },
  {
    id: 'blogs/2022/css3-pie',
    title: '用 css3 实现饼图',
    category: 'blog',
    desc:
      '开发中常常有做统计图的需求，主流的前端插件都是基于 canvas 来做的，' +
      '使用 css3 的渐变背景或路径裁切也一样可以实现同样的效果，渐变背景可以实现较为简单的基础效果，' +
      '路径裁切则能够实现比较强大的交互效果，只是路径裁切兼容性目前不是太好',
    tags: ['css', '前端', '饼图', '统计图'],
    rootComponentPath: '@/pages/blogs/2022/Css3Pie.vue',
    createAt: new Date('2022/01/15')
  },
  {
    id: 'blogs/2022/my-views-on-mini-program',
    title: '我对小程序的一些看法',
    category: 'blog',
    desc:
      '小程序自从出来之后就挺火的，到目前为止小程序的数量已经非常可观了，' +
      '各个平台都推出了自己的小程序。那么，如果要做一个新项目，我们是否应该考虑开发小程序呢？' +
      '或者，已有的项目有没有必要改造成小程序？',
    tags: ['微信', '小程序', 'html5', '跨平台开发', 'pwa'],
    rootComponentPath: '@/pages/blogs/2022/my-views-on-mini-program.md',
    createAt: new Date('2022/01/03')
  },
  {
    id: 'blogs/2022/java-bio-nio-aio',
    title: '几段代码感受 java 中的 bio、nio和aio',
    category: 'blog',
    desc: '网上经常看到关于同步和阻塞相关的推送或推荐，解释四种组合。很长一段时间我也搞不明白这些概念，但是似乎也对工作没有任何影响，带着这样的疑问，查阅了很多资料。网上有很多文章都是各种打比方，像排队买饭或是打电话预约等之类的，看了之后感觉更懵了，这里我使用 java 代码直观的展示各种模式。',
    tags: ['java', 'bio', 'nio', 'aio'],
    rootComponentPath: '@/pages/blogs/2022/java-bio-nio-aio.md',
    createAt: new Date('2022/06/09')
  },
  {
    id: 'blogs/2022/vue3-array-not-reactive',
    title: '记一次 vue3 数组不响应问题的排查',
    category: 'blog',
    desc: '最近在编程时，遇到了 vue3 数组更新却没有响应的问题，解决后，决定把这次的问题总结下，然后记录下来',
    tags: ['vue3', '前端'],
    rootComponentPath: '@/pages/blogs/2022/vue3-array-not-reactive.md',
    createAt: new Date('2022/06/12')
  },
  {
    id: 'blogs/2022/query-count',
    title: '分页查询的 count 问题',
    category: 'blog',
    desc:
      'Web应用的业务中常常会有分页查询的功能，让用户可以直观的看到匹配记录的数量，自由跳页快速翻看后面的数据。但是分页查询在数据量大和并发量较大时，往往会有比较严重的性能问题，' +
      '分页查询一般会使用 select count(*) 求总数，offset 实现跳页，问题常常出在这里',
    tags: ['sql', '数据库'],
    rootComponentPath: '@/pages/blogs/2022/query-count.md',
    createAt: new Date('2022/01/02')
  },
  {
    id: 'blogs/2022/improve-the-efficiency-of-small-teams',
    title: '小型开发团队如何提高生产力',
    category: 'blog',
    desc: '对于小规模的技术团队，人力有限却有众多繁杂的事情要处理，怎么样更有效的利用资源，提高开发效率呢？这篇文章我分享一些自己的看法。',
    rootComponentPath: '@/pages/blogs/2022/improve-the-efficiency-of-small-teams.md',
    createAt: new Date('2022/01/16')
  },
  {
    id: 'blogs/2022/wechat-moments-dbd',
    title: '类似微信朋友圈业务的数据库表结构设计',
    category: 'blog',
    tags: ['微信', '数据库'],
    desc: '今天聊一下类似微信朋友圈这样的业务该怎么设计数据库的表结构，纯个人观点，希望能够提供一点参考价值',
    rootComponentPath: '@/pages/blogs/2022/wechat-moments-dbd.md',
    createAt: new Date('2022/02/13')
  },
  {
    id: 'blogs/2022/java13-features',
    title: 'Java 13 主要更新内容',
    category: 'blog',
    tags: ['java', 'unicode', 'zgc'],
    desc: '支持了 Unicode 12.1，引入文本块语法，switch 语法做了增强, ZGC 内存优化，动态 CDS 归档，xml 相关 api 做了优化',
    rootComponentPath: '@/pages/blogs/2022/java-13-features.md',
    createAt: new Date('2022/04/09')
  },
  {
    id: 'blogs/2022/java9-features',
    title: 'Java 9 主要更新内容',
    category: 'blog',
    tags: ['java', '模块系统', 'VarHandle', 'gc', 'jshell', 'applet'],
    desc:
      '引入模块系统，调整版本号格式，增加新工具 jshell，命令行参数校验，废弃 Applet， ' +
      '简化 Doclet API，Javadoc 支持 html5 和搜索，废弃 CMS ，增加变量句柄 变量句柄 VarHandle' +
      '，压缩字符串，提供平台日志服务，循环等待提示 Spin-Wait Hints，Nashorn 引擎，下划线不再是一个合法的名称',
    rootComponentPath: '@/pages/blogs/2022/java-9-features.md',
    createAt: new Date('2022/03/02')
  },
  {
    id: 'blogs/2022/java10-features',
    title: 'Java 10 主要更新内容',
    category: 'blog',
    tags: ['java', 'docker', 'g1', 'gc', 'BCP', 'jshell'],
    desc:
      '版本号格式增加时间信息，引入 var 关键字增强类型推断，增加了对 BCP 47 的支持，' +
      'G1 回收器支持并行 Full GC，增强 for 循环的字节码生成，javadoc 增加 @summary 标签，' +
      '增强在 docker 容器中的可配置性，jshell 启动速度提升',
    rootComponentPath: '@/pages/blogs/2022/java-10-features.md',
    createAt: new Date('2022/03/09')
  },
  {
    id: 'blogs/2022/java11-features',
    title: 'Java 11 主要更新内容',
    category: 'blog',
    tags: ['java', 'zgc', 'JavaFx'],
    desc:
      '全新的 Http 客户端，新增 ZGC 和 Epsilon 回收器，引入巢（nest）解决嵌套访问取消桥接方式，lambda 增加了对 var 的支持，' +
      '支持像动态语言那样直接从源码文件启动，删除 JavaFX，删除已经废弃的线程方法',
    rootComponentPath: '@/pages/blogs/2022/java-11-features.md',
    createAt: new Date('2022/03/21')
  },
  {
    id: 'blogs/2022/java12-features',
    title: 'Java 12 主要更新内容',
    category: 'blog',
    tags: ['java'],
    desc:
      '支持 unicode 11，支持 POSIX_SPAWN 创建进程，引入 JVM 常量 API，数字格式化支持短格式，' +
      '支持日本新年号（令和）字符，switch 表达式语法进一步增强',
    rootComponentPath: '@/pages/blogs/2022/java-12-features.md',
    createAt: new Date('2022/03/29')
  },
  {
    id: 'blogs/2022/css-background-positon-ppercentage',
    title: '记一次 css background-position 遇到的坑',
    category: 'blog',
    tags: ['css', '前端'],
    desc:
      'background-position ， 一看名字就是设置背景位置的，第一反应就是和 position 差不多，然而设置了 left 和 top 却没有和我预想的一样，' +
      '总是调不到想要的位置，查了很多资料才搞明白',
    rootComponentPath: '@/pages/blogs/2022/css-background-positon-ppercentage.md',
    createAt: new Date('2022/02/16')
  }
]
