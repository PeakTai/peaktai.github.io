import 'wok-ui/dist/style.css'
import { DivModule, Text } from 'wok-ui'
// 页面模块，可以继承 Module 或 DivModule 来构建一个新的模块
class Page extends DivModule {
  constructor() {
    super()
    this.addChild('重构中')
  }
}
// 创建页面模块的实例，然后挂载到 body 上
new Page().mount(document.body)
