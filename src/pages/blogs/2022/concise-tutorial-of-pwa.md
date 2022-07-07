### 目标：让网站变成可安装应用

要让网站变成可安装，需要满足下面的条件：

- 设置 manifest，manifest 必须要有较为丰富的图标信息，部分尺寸的图标缺失会有影响
- 网站需要是 https 协议，本地开发无法测试
- 与 manifest 匹配的 service worker

下面来逐个解决。

### manifest

在 head 标签中添加 manifest 信息：

```html
<link rel="manifest" href="manifest.json" />
```

manifest.json 的内容大概像这样：

```json
{
  "name": "应用完整名称",
  "short_name": "应用短名称",
  "description": "应用描述信息",
  "start_url": "/", // 启动入口地址
  "display": "minimal-ui", // 显示模式，minimal-ui 表示让应用有独立窗口，显示尽可能少的控制元素
  "theme_color": "#ffffff", // 主题色，应用窗口顶标题栏的背景色
  "background_color": "#ffffff", // 样式加载前的页面背景色
  "icons": [
    // 图标
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192"
    }
  ]
}
```

关于 manifest 各个选项的详细说明可以参考：[Web app manifests | MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)。

图标很重要，某个尺寸的图标缺少可能会导致应用不可安装，如果不想设置那么多个，也可以只设置一个比较大的图标，至少 192x192 以上，能覆盖到浏览器需要的尺寸，实测在 edge 浏览器中可行。

你还可以使用 pwa 在线构建工具来生成图标：[PWA Image Generator](https://www.pwabuilder.com/imageGenerator)。

### service worker

service worker 你可以看成是一个后台运行的请求代理层，用来管理缓存文件，使用缓存文件来响应请求，减少联网。

#### 注册

在页面上添加脚本，注册 service worker:

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function (registration) {
      console.log('Service worker 注册成功:', registration)
    })
    .catch(function (error) {
      console.log('Service worker 注册失败:', error)
    })
}
```

这里的 scope 需要注意，默认不加参数就是 serviceWorker 脚本所在的目录，如果要设置也只能设置 serviceWorker 脚本所在目录
或其子目录。这个 scope 决定了是否能与 manifest 匹配，manifest 中 start_url 必须在 scope 下，否则不能安装，浏览器控制台会有提示：

![未检测到匹配的 service worker](/assets/blogs/2022/concise-tutorial-of-pwa/no-matching-service-worker.png)

#### 本地缓存版本管理

下面是 `sw.js` 代码，我们要完成一个简单的应用版本管理：

```js
// cache-files.js 提供了 cacheName 和 files
self.importScripts('/cache-files.js')
// 安装钩子，缓存所有文件
self.addEventListener('install', e => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      await cache.addAll(files)
    })()
  )
})
// 代理 fetch, 如果缓存中有则从缓存中取，没有则直接请求
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)))
})
// 在 service worker 激活成功后，检查并删除旧版本
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          // 缓存名称和当前不一致的就是以前的旧版本删除掉
          if (cacheName !== key) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
```

上面的代码中导入了 cache-files.js ，实际上也可以直接写在 sw.js 中，这样做是为了方便管理，
每次程序有升级，只改动 cache-files.js 即可，cache-files.js 也可以由脚本自动生成。

cache-files.js 代码：

```js
// 缓存名称带有版本号，每次程序发布新版本 cacheName 也跟着变化
const cacheName = 'my-app-v1.0.0'
// files 就是要缓存的文件列表，根据实际情况填写
const files = [
  'https://unpkg.com/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'https://unpkg.com/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  '/js/app.js',
  '/css/app.css',
  '/',
  '/index.html'
]
```

需要注意的是引入别的站点的 cdn 文件，需要支持跨域，得设置 cros 消息头，例如上面引入的 bootstrap ，
如果不支持跨域，则在安装的时候就会报错，缓存失败。另外站内的文件能否缓存和 service worker 的 scope 是有关的，
文件必须在 scope 下，否则不会触发 fetch 事件，无法被代理。

如果 scope 是 `/path/`，那么 `/path` 也是不能被代理的，访问 `/path` 这个页面的话，service worker 不会工作，
也不能进行任何代理，即使页面中引用的 js 或 css 文件等在 scope 内也不会有效果。而且，如果 service worker 的位置是
`/path/ws.js` ，scope 是不允许被设置成 `/path`，只能是 `/path/`。当然，如果你的 service worker 脚本在站点根目录，
就不必操心 scope 的这些麻烦事了。

想知道 service worker 有没有代理成功，可以在浏览器的控制台中查看网络。

![浏览器控制台查看网络](/assets/blogs/2022/concise-tutorial-of-pwa/network-service-worker.png)

如果代理成功，履行者应该是 ServiceWorker ，并且大小是 0，这表示成功使用了缓存，避免了联网。

到此 service worker 就开发完成了，应用已经可以安装了。如果你不需要应用可安装，不设置 manifest ，只单纯的使用 ServiceWorker 来缓存文件提速，也是可以的。

### 其它参考资料

通过上面的简单操作就可以让我们的网站变成可安装了，但是这太简单了，不一定能满足你的需求。
如果你想做更强大的版本控制，可以考虑使用谷歌的 [workbox](https://github.com/GoogleChrome/workbox)。
如果你还想了解更多 ServiceWorker 相关的 api 细节，或是想了解如何进行消息推送等，可以看看 MDN 的详细教程：
[渐进式 Web 应用（PWA） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)。

