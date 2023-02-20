import { Page } from './page'

export const blog2023Pages: Page[] = [
  {
    id: 'blogs/2023/java-18-features',
    title: 'Java 18 的主要新特性和代码演示',
    category: 'blog',
    desc:
      '默认编码改为 UTF-8,内置简单的 web 服务器用于测试和教学,重新实现的反射, 文档支持代码片段,' +
      'switch 模式匹配增强, GC 支持字符串消除节省内存,注解处理器 Elements 增加层元素获取方法,支持匹配卡表大小,弃用 finalize',
    tags: ['java', 'finalize', 'switch'],
    rootComponentPath: '@/pages/blogs/2023/java-18-features.md',
    createAt: new Date('2023/01/03')
  },
  {
    id: 'blogs/2023/java-19-features',
    title: 'Java 19 的主要新特性和代码演示',
    category: 'blog',
    desc:
      '支持 Unicode14.0，支持自定义 System.out 输出，支持 Pointer Authentication' +
      '，支持设置 TLS 签名模式，虚拟线程预览版本',
    tags: ['java'],
    rootComponentPath: '@/pages/blogs/2023/java-19-features.md',
    createAt: new Date()
  }
]
