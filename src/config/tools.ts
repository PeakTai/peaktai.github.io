import { Page } from './page'

export const toolPages: Page[] = [
  {
    id: 'tools/calculator',
    title: '财务计算器',
    category: 'tool',
    desc:
      '自己平常做报销单用的，方便的一次运算然后转换金额大写，支持历史记录，' +
      '可查看计算步骤，支持百分比数字，可配置舍入模式和精度，计算本身没有限制，' +
      '对于不适合转换成金额的结果无法使用转换功能',
    tags: ['财务', '计算器', '大小写转换', '计算步骤演示'],
    rootComponentPath: '@/pages/tools/calculator/Index.vue'
  },
  {
    id: 'tools/binary-viewer',
    title: '文件二进制查看器',
    category: 'tool',
    desc:
      '以二制进的形式呈现文件内容，支持查看字节对应的ASCII码和十六进制，对设备有较高要求，' +
      '大文件可能会造成严重卡顿,硬件较差的设备可通过选项减少显示内容',
    tags: ['binary', 'viewer', '二进制查看'],
    rootComponentPath: '@/pages/tools/binary-viewer/Index.vue'
  },
  {
    id: 'tools/browser-info',
    title: '浏览器信息',
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
  }
]
