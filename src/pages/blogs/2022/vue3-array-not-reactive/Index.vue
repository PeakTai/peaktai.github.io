<template>
  <BlogLayout>
    <p>
      最近在编程时，遇到了 vue3 数组更新却没有响应的问题，解决后，决定把这次的问题总结下，记录下来。
    </p>
    <h3>代码重现</h3>
    <p>项目的代码太复杂了，我做了一个超精简版本的重现代码：</p>
    <CodeHighlight :code="reproduction1" language="html5"></CodeHighlight>
    <p>item-service 代码：</p>
    <CodeHighlight :code="reproductionItemService" language="ts"></CodeHighlight>
    <p>
      tem-service 中缓存了列表对象，然后组件中一直使用 item-service 中缓存的这个列表给 data 赋值
      ，问题就出在这。
    </p>
    <h3>程序调试</h3>
    <p>
      vue3 的响应式是通过 Proxy 实现的，我在 onItemsChange 回调时做了调试，下面是 Proxy handler 的
      set 方法的调试过程。为了方便查看，调试中没有被执行到的代码都注释掉了，并且加了一些说明。
    </p>
    <CodeHighlight :code="proxySetDebugInfo" language="js"></CodeHighlight>
    <p>可以看到没有触发任何更新，因此没有响应。</p>
    <h3>原因总结</h3>
    <p>
      原因总算确定了，其实就是因为被代理的数组，和要赋值的数组是同一个数据，在 Proxy
      的回调中判定值没有改变，没有触发更新。
    </p>
    <CodeHighlight
      code="
    // data.list 是 list 的代理对象，将 data.list 提取原始值（toRaw）就是 list
    data.list = list
    "
    ></CodeHighlight>
    <p>处理的方法也比较简单，将数组简单的克隆下，就没有问题了。</p>
    <CodeHighlight
      code="
      getItems().then((res) => data.list = [...res]).catch(console.error)
      onItemsChange((list) => data.list = [...list])"
    ></CodeHighlight>
    <p>
      我这种情况是由于缓存数据共享对象引起的，对于需要共享数据的项目，还可以使用状态管理组件，vuex
      或 pinia。
    </p>
    <h3>对象是否也有同样问题？</h3>
    <p>
      既然是因为复用数组，代理回调因为值没有改变最终没有触发更新，那么对象是否也存在这样的问题呢，我写了个简单的代码验证了下：
    </p>
    <CodeHighlight :code="reproduction2" language="html5"></CodeHighlight>
    <p>
      答案是肯定的，问题仍然存在。如果存在这种情况，可以将对象克隆下（使用 Object.assign()
      或其它的方法）得到一个新的对象，再给响应式数据赋值来解决。
    </p>
  </BlogLayout>
</template>
<script setup lang="ts">
import BlogLayout from '@/components/blog-layout/BlogLayout.vue'
import CodeHighlight from '@/components/CodeHighlight.vue'
import reproduction1 from './reproduction-1.txt'
import reproduction2 from './reproduction-2.txt'
import reproductionItemService from './reproduction-item-service.txt'
import proxySetDebugInfo from './proxy-set-debug-info.txt'
</script>
