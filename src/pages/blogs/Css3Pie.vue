<template>
  <blog-layout>
    <p>
      开发中常常有做统计图的需求，主流的前端插件都是基于 canvas 来做的，
      那么使用 css3 能不能实现呢？今天我来尝试一下使用 css3 做一个饼图效果。
    </p>
    <h3>渐变背景</h3>
    <p>css3 在背景图片中增加了渐变，使用锥形渐变（conic-gradient）我们可以很方便的就实现一个饼图。</p>
    <div class=" row row-cols-1 row-cols-md-2">
      <div class="col text-center text-md-start">
        <div class="pie d-inline-block"></div>
      </div>
      <div class="col">
        <CodeHighlight code="
        .pie {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: conic-gradient(
            blue 36deg,
            green 36deg 170deg,
            cadetblue 170deg);
        }">
        </CodeHighlight>
      </div>
    </div>
    <p>
      上面的效果就是渐变背景实现的，通过圆角将元素显示成圆形，再通过锥形渐变，
      围绕着中心点给划分区域填充颜色就可以了。这个方法实现起来非常的简单，适合要求不高的场景。如果想要有点动态效果，比如说鼠标悬停在扇区内，
      扇区突出显示或者显示扇区对应的数据，可能就无法满足了。
    </p>
    <p>参考文档：<a target="_blank"
        href="https://developer.mozilla.org/en-US/docs/web/css/gradient/conic-gradient">conic-gradient() - CSS:
        Cascading Style Sheets | MDN</a>。</p>
    <h3>元素形状剪裁</h3>
    <p>
      既然要给不同的扇区添加动态效果，必须得让每个扇都是一个元素，然后给元素添加事件或添加伪类样式。那么怎么样才可以让元素显示成扇形的样子呢？这个我们可以通过 clip-path 来实现，clip-path
      使用裁剪方式创建元素的可显示区域，区域内的部分显示，区域外的隐藏。clip-path 支持四种图形裁剪：inset，circle，polygon，path，这里我们使用 path
      来直接裁剪出扇形。通过圆角将元素变成圆形，然后再使用多边形（polygon）裁剪也可以得到扇形，但是会复杂非常多。关于 clip-path 的详细信息，可参考文档：
      <a target="_blank" href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path">clip-path - CSS（层叠样式表） |
        MDN</a>。
    </p>
    <h4>准备数据</h4>
    <p>下图是 tiobe 2022 编程语言排行，太长我只截取了一部分，为了简单不在图中的部分归到 other 中。</p>
    <figure>
      <img src="/assets/blogs/css3-pie/tiobe-2022.png" class=" img-fluid" alt="tiobe-2022" />
      <figcaption>toobe-2022</figcaption>
    </figure>
    <p>最后得到的统计数据是这样的：</p>
    <CodeHighlight code="
      const data = [
        {ratio: 0.1358, title: 'Python 13.58%'},
        {ratio: 0.1244, title: 'C 12.44%'},
        {ratio: 0.1066, title: 'Java 10.66%'},
        {ratio: 0.0829, title: 'C++ 8.29%'},
        {ratio: 0.0568, title: 'C# 5.68%'},
        {ratio: 0.0474, title: 'Visual Basic 4.74%'},
        {ratio: 0.0209, title: 'JavaScript 2.09%'},
        {ratio: 0.4252, title: 'Other 42.52%'},
      ]
    " language="js"></CodeHighlight>

    <h4>计算路径</h4>
    <p>接下来做一个函数来计算出样式，clip-path 中的 path 模式和 svg 中的 path 是一样的，我们主要用到4个命令：M 移动，L 绘制直线，A 绘制弧形，Z 关闭路径。</p>
    <p>
      <img src="/assets/blogs/css3-pie/clip-path-1.png" alt="clip-path 路径说明" class="img-fluid">
    </p>
    <p>上面是裁剪的路径流程示意图，中心点是固定的，需要计算出圆弧上的起止的两个坐标点。</p>
    <p>
      <img src="/assets/blogs/css3-pie/clip-path-2.png" alt="cli-path 角度计算" class=" img-fluid">
    </p>
    <p>按图上的方法来计算坐标点（超出 90 度也适用），编写计算一个函数来计算对应百分比在圆弧上的点坐标。</p>
    <CodeHighlight code="
    function execPoint(cx, cy, r, ratio) {
        // 计算弧度，一个整圆弧度是 2π
        const rad = ratio* 2 * Math.PI
        return {
            x: cx + Math.sin(rad) * r,
            y: cy - Math.cos(rad) * r
        }
    }
    " language="js"></CodeHighlight>
    <p>继续编写计算扇区路径的函数：</p>
    <CodeHighlight code="
    function buildSectorPaths(data, width) {
      // 偏转量
      let offset = 0
      // 圆心坐标
      const cx = width / 2
      const cy = width / 2
      // 半径
      const r = width / 2
      const result = []
      for (const datum of data) {
        let path = `M ${cx},${cy}`
        // 圆弧起点
        const start = execPoint(cx, cy, r, offset)
        path += ` L ${start.x},${start.y}`
        // 圆弧终点
        offset += datum.ratio
        const end = execPoint(cx, cy, r, offset)
        // 圆弧大于半圆画大圆，否则画小圆
        const angle = datum.ratio * 2 * Math.PI
        path += ` A ${r},${r} 0,${angle > Math.PI ? 1 : 0},1 ${end.x},${end.y}`
        path += ' Z'
        result.push(path)
      }
      return result
    }"></CodeHighlight>
    <h4>完成饼图布局</h4>
    <p>基础样式：</p>
    <CodeHighlight code="
    .pie {
      width: 300px;
      height: 300px;
      position: relative;
    }

    .pie .sector {
      position: absolute;
      width: 100%;
     height: 100%;
    }" language="css"></CodeHighlight>
    <p>完成生成饼图函数，并执行：</p>
    <CodeHighlight code="
    function buildPie(containerEl, data) {
      containerEl.classList.add('pie')
      const paths = buildSectorPaths(data, 300)
      for (let path of paths) {
        const sector = document.createElement('div')
          sector.classList.add('sector')
          sector.style.clipPath = `path('${path}')`
          // 给个随机背景色
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          sector.style.backgroundColor = `rgb(${r},${g},${b})`
          containerEl.appendChild(sector)
      }
    }

    const pie = document.getElementById('pie')
    buildPie(pie, data)"></CodeHighlight>
    <p>最后我们得到一个饼图：</p>
    <p class=" text-center">
      <img src="/assets/blogs/css3-pie/rendering-1.png" alt="效果图" class="img-fluid" style="height: 250px;">
    </p>
    <h4>添加交互效果</h4>
    <p>
      到这里就和之前使用背景图渐变实现的效果一样了，但是每一个扇区都是一个 dom 元素，这意味着我们可以给它加样式或加事件来实现动态效果。那么继续改造一下，
      让鼠标悬停在扇区的时候突出扇区，并显示对应的标题。在每 .sector
      的后面加一个兄弟元素 .title，当 .sector 有鼠标悬停的时候 title 才在右侧显示出来。此外，再给 .sector 增加一个鼠标悬停放大的效果。
    </p>
    <CodeHighlight code="
    .pie .sector {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: all .3s ease-in;
    }

    .pie .sector:hover {
      transform: scale(1.1);
    }

    .pie .title {
      display: none;
    }

    .pie .sector:hover + .title {
      position: absolute;
      top: 50%;
      left: 110%;
      width: 120px;
      transform: translateY(-50%);
      display: block;
    }" language="css"></CodeHighlight>
    <p>代码稍微改一下，在扇区后面加一个标题元素</p>
    <CodeHighlight code="
    function buildPie(containerEl, data) {
      containerEl.classList.add('pie')
      const paths = buildSectorPaths(data, 300)
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const sector = document.createElement('div')
        sector.classList.add('sector')
        sector.style.clipPath = `path('${path}')`
        // 给个随机背景色
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        sector.style.backgroundColor = `rgb(${r},${g},${b})`
        containerEl.appendChild(sector)
        // 新增加的标题
        const title = document.createElement('div')
        title.classList.add('title')
        title.innerText = data[i].title
        containerEl.appendChild(title)
      }
    }"></CodeHighlight>
    <p>看看最终的效果（将鼠标放上去会有交互效果，ie 和很多移动端浏览器由于兼容性问题可能看不到效果）：</p>
    <iframe src="/assets/blogs/css3-pie/css3-pie.html" style="width:100%;height:380px"></iframe>
    <h3>总结</h3>
    <p>
      使用 css3 实现饼图整体上比基于 canvas 简单一些，毕竟基于 canvas 的话除了绘制状态外还需要实现元素边缘判定和事件绑定机制，而这些 dom 本来就有的，有些交互不需要写 js 直接 css
      就可以实现，你只管裁剪出需要的形状就好。但是，path 裁剪的兼容性不是很好，ie 就别想了，移动端很多浏览器也不支持，使用需谨慎。
    </p>
    <p>最后附上完整代码，<a target="_blank" href="/assets/blogs/css3-pie/css3-pie.html">点击此处可下载 html 文件</a>。</p>


  </blog-layout>
</template>
<script setup lang="ts">
import CodeHighlight from '@/components/CodeHighlight.vue';
import BlogLayout from '@/components/blog-layout/BlogLayout.vue';
</script>
<style scoped>
.pie {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: conic-gradient(blue 36deg,
      green 36deg 170deg,
      cadetblue 170deg);
}
</style>
