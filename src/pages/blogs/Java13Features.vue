<template>
  <blog-layout>
    <h2>支持会计风格的货币格式</h2>
    <p>通过 NumberFormat.getCurrencyInstance(Locale) 可以获取会计风格的货币格式，只对部分 locale 支持。下面是中国货币代码示例：</p>
    <code-highlight code="
    final NumberFormat format = NumberFormat.getCurrencyInstance(Locale.CHINA);
    System.out.println(format.format(0.5));// ¥0.50
  " language="Java"></code-highlight>
  </blog-layout>
</template>
<script lang="ts" setup>
import CodeHighlight from '@/components/CodeHighlight.vue'
import BlogLayout from '@/components/blog-layout/BlogLayout.vue'
</script>
