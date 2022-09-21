### 自定义原生播放器控制器功能限制下载

html5 播放器默认是可以下载视频的，在默认的控制器（给 video 标签添加 controls 属性开户）上会有下载菜单，
即使不使用默认提示的控制器，右键弹出的上下文菜单中也会有保存视频的选项。

![html5 video player downloadable](/assets/blogs/2022/html5-video-player-prevent-download/h5-video-downloadable.png)

通过 controlslist 属性可以设置浏览器提供的控制器，不让下载菜单显示出来。controlslist 还可以设置不显示全屏等功能同，但是浏览器
支持较差，尤其是移动端浏览器。

```html
<video src="test.mp4" playsinline autoplay="false" controls controlslist="nodownload"></video>
```

演示效果：

<iframe src="/assets/blogs/2022/html5-video-player-prevent-download/controlslist-nodownload.html" style="width: 100%; height: 260px"></iframe>

将 controlslist 的值设置为 nodownload ，就不会出现下载菜单了，不过 PC 上点击右键的上下文菜单的保存视频选项仍然有用，还是很容易被下载。

如果是通过自定义样式来控制播放暂时等操作的控制条，还可以将 video 禁右键或者蒙上一层 div 来阻止弹出上下文菜单，防止下载。

### 利用 Media Source Extensions (MSE) 实现加密防下载

虽然通过 controlslist 可以防止下载，但是有些浏览器不支持，很多移动端的浏览器会直接接管播放器。
如果用户懂一点技术，捕获视频文件的链接，就可以直接打开链接进行下载了。
我们可以利用 Media Source Extensions API 来给文件做加密，这套技术本来是用于扩展的，通过扩展可以兼容更多
的视频格式，可以认为是前端的一套自定义转码的接口，将文件实时转码成浏览器支持的格式。

服务器端做好视频的加密，将原视频文件通过对称性加密生成一个加密新文件，客户端将加密的新文件加载后进行解密，
然后将解密后的原文件内容通过 MediaSource 推送，完成视频的播放。

```js
const video = document.getElementById('videoId')
// 视频编码译码器，使用工具 mp4info 可以查看
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

const mediaSource = new MediaSource()
video.src = URL.createObjectURL(mediaSource)
mediaSource.addEventListener('sourceopen', e => {
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
  // 请求加密文件，然后解密添加到 sourceBuffer，也可以将文件裁切成多个部分,分多次加载
  fetch('./chunk')
    .then(async resp => {
      const blob = await resp.blob()
      const buf = await blob.arrayBuffer()
      sourceBuffer.addEventListener('updateend', () => {
        // 如果是多个文件块，可以在判定已经添加完所有块后结束（一般会搞个块列表做比对的）
        mediaSource.endOfStream()
      })
      // decode 是自定义的解码函数，将请求到的加密文件 chunk 内容解密成为真正的 mp4 文件
      // ，要与前面的 mimeCodec 对应，否则会有错误
      // 这个示例省略了很多错误处理，要处理错误需要对 mediaSource 和 sourceBuffer 做 error 事件处理
      sourceBuffer.appendBuffer(decode(buf))
      console.log('appendBuffer after')
    })
    .catch(console.error)
})
```

演示效果：

<iframe src="/assets/blogs/2022/html5-video-player-prevent-download/controlslist-nodownload.html" style="width: 100%; height: 260px"></iframe>

这样处理后，通过控制台 network 查看到的是加密文件的请求地址，拿到后也不能播放，查看 video 标签源地址是
生成的临时地址，也无法直接打开。并且，通过 Media Source Extensions API 还可以实现视频分块做按需加载。
其实 video 标签播放视频也会自动按需请求内容（仅部分浏览器），需要服务器做好对 Range 消息头的支持，根据参数来返回部分文件内容。
不过 Media Source Extensions API 的兼容性不是很好，ie 和 safari 都是不支持的，
新版本 mac 上的 safari 不知道是否能支持。经过测试，小部分移动端浏览器也不支持，无法显示出视频，大部分移动端浏览都可以支持的很好。
有些网站的播放器做了兼容，对于不支持 MSE 的浏览器仍然使用 video 标签播放原 mp4 文件。

### 基于 canvas 实现播放器

基于 canvas 也是一种方案，好处是不会被浏览器识别成视频，也就不会被接管。很多不太规范的移动端浏览器
都是直接接管视频播放器，自定义的播放器样式完全没用，不会被显示出来，使用 canvas 就可以解决这个问题。

```html
<canvas height="240" width="320" id="player" onclick="playOrPause()"></canvas>
```

```js
const canvas = document.getElementById('player')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const video = document.createElement('video')
video.addEventListener('canplay', e => {
  // 渲染封面
  this.renderCover()
})
fetch('./test.mp4')
  .then(async resp => {
    const blob = await resp.blob()
    video.src = URL.createObjectURL(blob)
  })
  .catch(console.error)

function playOrPause() {
  if (video.ended) {
    return
  }
  if (video.paused) {
    video.play()
    startRender()
  } else {
    video.pause()
  }
}

function startRender() {
  requestAnimationFrame(() => {
    renderVideo()
    if (!video.paused && !video.ended) {
      startRender()
    }
  })
}

function renderCover() {
  ctx.clearRect(0, 0, 320, 240)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 320, 240)
  ctx.font = '40px Arial'
  ctx.fillStyle = '#ffffff'
  const text = '点击播放'
  const m = ctx.measureText(text)
  ctx.fillText(text, 320 / 2 - m.width / 2, 240 / 2 + 40 / 2)
}

function renderVideo() {
  ctx.clearRect(0, 0, 320, 240)
  ctx.drawImage(video, 0, 0, 320, 240)
  if (video.paused) {
    ctx.font = '40px Arial'
    ctx.fillStyle = '#ffffff'
    const text = '已暂停'
    const m = ctx.measureText(text)
    ctx.fillText(text, 320 / 2 - m.width / 2, 240 / 2 + 40 / 2)
  }
}
```

效果演示:

<iframe src="/assets/blogs/2022/html5-video-player-prevent-download/canvas-player.html" style="width: 100%; height: 300px"></iframe>

以上仅仅是非常简单的 demo，这个方案真要完善工作量还是挺大的，除操作条和字幕功能外，视频全屏还需要做一定的重新渲染处理，
有些浏览器还不支持全屏 API (requestFullscreen)，导致没有办法将视频全屏展示。 即便如此，也无法保证百分百不能被下载，
有些浏览器还有媒体嗅探功能，当请求了媒体文件后，就会被检测到，提示用户检测到有媒体文件，
询问用户是否要下载。

![浏览器资源嗅探](/assets/blogs/2022/html5-video-player-prevent-download/resource-sensing.jpg)

经过我对某个移动端浏览器的测试，改 content-type 和后缀名也不行，只要请求的是视频文件就会被检测到。
只有把文件加密，请求的是加密文件，不是真正的视频文件，这样就不能被检测到了，然后客户端解密后再播放。

实测这个方案兼容性也不是很好，部分移动端浏览器会渲染不出来视频内容，有些还会出现卡顿和图像错乱。不过微信内置
以及火狐等一些较为先进的移动端浏览器支持的都比较好。不过，使用了 canvas 方案就没有一些原生功能的支持的，如
小窗播放（画中画模式）。

### 总结

经过我的测试，对 MSE 和 canvas 方案无法支持的浏览器，恰恰是一些以下载视频为特色的移动端浏览器，
这些浏览器内核可能也比较旧，或者是因为修改内核导致的不兼容，不考虑这些浏览器 MSE 应该是最佳方案，
因为 MSE 可以实现按需渐近加载视频。

由于视频本身就非常耗资源，即时加密对服务器要求高，最好是先加密好。
加密必须是对称性的，能加密也能解密，通过破解前端代码掌握解密方法，仍然有办法解开视频内容。
如果视频是提前加密好再存储的，也不好去搞动态密钥。

html5 视频播放器想要下载并做好兼容是非常困难的，基本上不太可能。有些对版权保护比较严格的网站，采取了
只能使用客户端看视频的方案，体验上就差一些了。比如 cctalk 这个平台，视频作者可以设置保护，对于需要保护的
视频只能通过客户端观看，其它的视频仍然可以网页上直接播放。
