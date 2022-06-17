最近在编程时，遇到了 vue3 数组更新却没有响应的问题，解决后，决定把这次的问题总结下，记录下来。

### 代码重现

项目的代码太复杂了，我做了一个超精简版本的重现代码：

```html
<template>
  <div>
    <pre>{{ data.list }}</pre>
    <p>
      <button type="button" @click="add">添加</button>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { getItems, onItemsChange, addItem } from './item-service'

const data = reactive({
  list: [] as string[],
})

getItems().then((res) => data.list = res).catch(console.error)
onItemsChange((list) => data.list = list)

function add() {
  addItem(new Date().toLocaleString())
}
</script>
```

item-service 代码：

```ts
// 条目列表缓存对象
let _items: string[] | undefined = undefined

type Listener = (items: string[]) => void
const listeners: Array<Listener> = []

export async function getItems(): Promise<string[]> {
  if (_items) {
    return _items
  }
  // 从服务器请求数据
  _items = await doAjax()
  return _items
}

export async function addItem(item: string) {
  const items = await getItems()
  items.push(item)
  listeners.forEach(listener => listener(items))
}

export async function onItemsChange(listener: Listener) {
  listeners.push(listener)
}
```

tem-service 中缓存了列表对象，然后组件中一直使用 item-service 中缓存的这个列表给 data 赋值，问题就出在这。

### 程序调试

vue3 的响应式是通过 Proxy 实现的，我在 onItemsChange 回调时做了调试，下面是 Proxy handler 的 set 方法的调试过程。为了方便查看，调试中没有被执行到的代码都注掉了，并且加了一些说明。

```js
// 注释掉的代码都是调试过程中没有被执行的代码
function set(target, key, value, receiver) {
  // 代理 handler 的 set 方法参数说明：
  // target 原始对象，getItems() 返回的 list
  // key 属性名称，‘list’
  // value 要设置的值，onItemsChange 回调的 list 对象
  // receiver 最初被调用的对象,通常是 proxy 本身，这里就是 data.list， list的代理对象
  let oldValue = target[key];
  // 使用 shallowReactive 的情况下 shallow 标记是 true ，这里是 false
  if (!shallow && !isReadonly(value)) {
    value = toRaw(value);
    oldValue = toRaw(oldValue);
    // export const isArray = Array.isArray
    // !isArray(target) 返回 false
    if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
      // oldValue.value = value;
      // return true;
    }
  }
  const hadKey =
    isArray(target) && isIntegerKey(key) // isIntegerKey(key) 返回 false，下行不执行
      // ? Number(key) < target.length
      : hasOwn(target, key); // true
  // 使用反射设置值，相当于 data.list = list
  const result = Reflect.set(target, key, value, receiver);
  // don't trigger if target is something up in the prototype chain of original
  // 如果 target 是被代理的原始对象原型链上的某个对象就不触发
  // 实际上原始对象就是 target
  if (target === toRaw(receiver)) {
    if (!hadKey) {
      // 没有 key （'list'）属性，就触发 add
      // hadKey = true
      // trigger(target, "add" /* ADD */, key, value);
    } else if (hasChanged(value, oldValue)) {
      // hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)
      // value 和 oldValue 是同一个 list 数组对象, hasChanged 返回 false
      // trigger(target, "set" /* SET */, key, value, oldValue);
    }
  }
  return result;
}
```

可以看到没有触发任何更新，因此没有响应。

### 原因总结

原因总算确定了，其实就是因为被代理的数组，和要赋值的数组是同一个数据，在 Proxy 的回调中判定值没有改变，没有触发更新。

```js
// data.list 是 list 的代理对象，将 data.list 提取原始值（toRaw）就是 list
data.list = list
```

处理的方法也比较简单，将数组简单的克隆下，就没有问题了。

```js
getItems().then((res) => data.list = [...res]).catch(console.error)
onItemsChange((list) => data.list = [...list])
```

我这种情况是由于缓存数据共享对象引起的，对于需要共享数据的项目，还可以使用状态管理组件，vuex 或 pinia。

### 普通对象是否也有同样问题？

既然是因为复用数组，代理回调因为值没有改变最终没有触发更新，那么对象是否也存在这样的问题呢，我写了个简单的代码验证了下：

```html
<template>
  <div>
    <pre>{{ data.user }}</pre>
    <p>
      <button type="button" @click="changeAge"> change age</button>
    </p>
  </div>
</template>
<script setup lang="ts">import { reactive } from 'vue';
const user = { name: 'Tony', age: 44 }

const data = reactive({
  user: { name: '', age: 1 }
})

data.user = user

function changeAge() {
  user.age = Math.round(Math.random() * 100)
  data.user = user
}
</script>
```

答案是肯定的，问题仍然存在。如果存在这种情况，可以将对象克隆下（使用 Object.assign() 或其它的方法）得到一个新的对象，再给响应式数据赋值来解决。
