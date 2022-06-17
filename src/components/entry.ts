import { createApp } from 'vue'
import raw from ''
import { buildMarkdownComponent } from '@/components/markdown'

createApp(buildMarkdownComponent(raw)).mount('#app')
