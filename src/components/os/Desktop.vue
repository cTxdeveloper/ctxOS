<template>
  <main class="w-full h-full relative">
    <Window
      v-for="win in windows"
      :key="win.id"
      :id="win.id"
      :app-id="win.appId"
      :title="win.title"
      :app-component="win.component"
      :app-props="win.appProps"
      :position="win.position"
      :size="win.size"
      :z-index="win.zIndex"
      :is-minimized="win.isMinimized"
    />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOSStore } from '../../store/osStore'
import Window from './Window.vue'

const osStore = useOSStore()
const { windows } = storeToRefs(osStore)
</script>