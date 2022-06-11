<template>
  <Layout>
    <div class="container lh-lg py-5 mw-100" style="width: 800px">
      <h1 class="mb-3 pb-3">关于本站</h1>
      <p>你好，有缘人，欢迎你访问我的个人网站“步入循环”！</p>
      <p>
        我是一名普通的中国互联网前线编程员，主要从事 web 方面的开发，语言以 JavaScript 和 Java
        为主。 在这里我会分享一些我个人在学习成长中的心得体会和见解， 也会放一些小工具和代码演示
        ，主要是自己偶尔用用，方便开发。
      </p>
      <p>
        相信很多人都会和我一样，到了一定的年纪，生活模式变得固定了，每天都在重复，也就是我们常说的两点一线，
        所以我把网站的名字叫做”步入循环“，其实名字和编程并没有关系，网站上的内容就是我在人生这个阶段创作的。
        // TODO
      </p>

      <p class="text-break">
        如果你对本站的功能实现有兴趣，想搭建类似的个人博客网站，可以查看和参考本站的源代码：
        <a href="https://github.com/PeakTai/peaktai.github.io">
          https://github.com/PeakTai/peaktai.github.io
        </a>
        ，希望对你有有用！
      </p>
      <p>
        <strong>
          虽然你可以使用本站的源代码，但是本站的所有文章版权归个人所有，转载需要注明出处，并保留原文链接!
        </strong>
      </p>

      <h2 class="pb-3 mb-2 mt-5">联系留言</h2>
      <p>
        如果你发现网站的 BUG ，可以在源码仓库发
        <a target="_blank" href="https://github.com/PeakTai/peaktai.github.io/issues/new">ISSUE</a
        >，或者发<a href="mailto:peaktai@qq.com">邮件</a>给我。
      </p>
      <p>
        邮件我会经常看，使用的频率低于聊天软件。 GitHub
        由于国内网络原因使用起来并不流畅，上的不多，Issue 可能很少会看，处理不及时。
      </p>
      <p>我的邮箱：<a href="mailto:peaktai@qq.com">peaktai@qq.com</a></p>
    </div>
  </Layout>
</template>

<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
</script>
