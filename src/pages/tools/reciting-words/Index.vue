<template>
  <Layout>
    <div class="container-xxl py-5">
      <template v-if="data.tab === 'home'">
        <h1 class="pb-3 mb-2">
          <IconWord></IconWord>
          &nbsp;背单词
        </h1>
        <p class="lead mb-5">
          最近在努力学英语，于是便搞了一个背单词的前端小程序。 程序中的单词词来自于
          <a href="https://github.com/first20hours/google-10000-english">google-10000-english </a>，
          包含了一万个最常用的英语单词，但是实际在程序中却并没有这么多，去掉了一些没有查到释义和一些非常不文明的词汇，
          被去掉的这些词汇现实生活中也不可能用的到。背单词的过程中总有些长的很像的单词分不清楚，所以程序中专门
          增加了相似词推荐的功能。
        </p>
        <div class="row g-3 row-cols-md-3 row-cols-lg-4 mb-3">
          <div class="col">
            <div class="border rounded p-3 cursor-pointer h-100" @click="data.tab = 'review'">
              <p class="fw-blod fs-4">单词自检</p>
              <p class="text-muted">手动播放单词，可查看单词释义、将单词标记为已掌握</p>
            </div>
          </div>
          <div class="col">
            <div class="border rounded p-3 cursor-pointer h-100" @click="data.tab = 'reciting'">
              <p class="fw-blod fs-4">背单词</p>
              <p class="text-muted">
                随机抽取未掌握的单词，以选择题的形式呈现，答对自动标记为通过，不认识的单词可以选择放弃
              </p>
            </div>
          </div>
          <div class="col">
            <div class="border rounded p-3 cursor-pointer h-100" @click="data.tab = 'word-list'">
              <p class="fw-blod fs-4">词汇表</p>
              <p class="text-muted">
                在一个列表中查看所有的单词，支持过滤，可以列表中将已经标记为已掌握的单词取消标记
              </p>
            </div>
          </div>
          <div class="col">
            <div class="border rounded p-3 cursor-pointer h-100" @click="data.tab = 'vocabulary'">
              <p class="fw-blod fs-4">词汇量测试</p>
              <p class="text-muted">
                基于现有的词库（google-10000-english），在各个不同的使用频率范围内随机抽取单词进行测验，评估大概的词汇量
              </p>
            </div>
          </div>
        </div>
      </template>
      <WordList v-if="data.tab === 'word-list'" @back="data.tab = 'home'"></WordList>
      <Review v-if="data.tab === 'review'" @back="data.tab = 'home'"></Review>
      <VocabularyTest v-if="data.tab === 'vocabulary'" @back="data.tab = 'home'"></VocabularyTest>
      <RecitingWords v-if="data.tab === 'reciting'" @back="data.tab = 'home'"></RecitingWords>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import { reactive } from 'vue'
import IconWord from '../../../components/icons/IconWord.vue'
import WordList from './WordList.vue'
import Review from './Review.vue'
import VocabularyTest from './VocabularyTest.vue'
import RecitingWords from './RecitingWords.vue'

type Tab = 'home' | 'word-list' | 'review' | 'vocabulary' | 'reciting'

const data = reactive<{
  tab: Tab
}>({
  tab: 'home'
})
</script>
<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
