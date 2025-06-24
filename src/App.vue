<template>
  <Toaster theme="dark" position="bottom-right" richColors />
  <Startup v-if="uiStore.bootState !== 'booted'" />
  <HomeView v-else />
  <CommandPalette v-if="uiStore.commandPaletteOpen" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from './store/uiStore'
import { useEventListener } from '@vueuse/core'
import Startup from './views/Startup.vue'
import HomeView from './views/HomeView.vue'
import CommandPalette from './components/os/CommandPalette.vue'
import { Toaster } from 'vue-sonner'

const uiStore = useUIStore()

onMounted(() => {
  setTimeout(() => uiStore.startBoot(), 500)
})

useEventListener(document, 'keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    uiStore.toggleCommandPalette()
  }
})
</script>