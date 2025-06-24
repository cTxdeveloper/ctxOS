<!-- src/components/applications/ReadmeViewer.vue -->
<template>
  <div
    class="prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary prose-a:text-accent1 prose-strong:text-text-primary"
    v-html="renderedMarkdown"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

// You might need to install the tailwind typography plugin for `prose` to work
// npm install -D @tailwindcss/typography
// Then add `require('@tailwindcss/typography')` to the plugins array in tailwind.config.js

const props = defineProps<{
  content: string
}>()

const renderedMarkdown = computed(() => {
  return marked(props.content || '', { gfm: true, breaks: true })
})
</script>