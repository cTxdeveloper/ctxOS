<!-- src/components/os/StartMenu.vue -->
<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 10 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 150 } }"
    class="absolute bottom-14 left-2 w-72 h-96 glass-pane p-2 flex flex-col z-[200]"
  >
    <div class="flex-grow">
      <h3 class="font-primary text-text-primary mb-2">Applications</h3>
      <ul>
        <li
          v-for="app in apps"
          :key="app.id"
          @click="() => launchApp(app.id)"
          class="flex items-center gap-3 p-2 rounded-md hover:bg-border cursor-pointer"
        >
          <component :is="(icons as any)[app.icon]" class="w-6 h-6 text-accent1" />
          <span class="font-semibold">{{ app.title }}</span>
        </li>
      </ul>
    </div>
    <div class="border-t border-border pt-2">
      <!-- Add power/logout buttons here if you want -->
      <div class="flex items-center justify-end gap-4">
          <p class="text-sm font-bold font-primary">ctx</p>
          <div class="w-8 h-8 rounded-full bg-accent2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOSStore } from '../../store/osStore'
import * as icons from 'lucide-vue-next'

const emit = defineEmits(['close'])

const osStore = useOSStore()
const { apps } = storeToRefs(osStore)

const launchApp = (appId: string) => {
  osStore.openWindow(appId)
  emit('close') // Close the start menu after launching an app
}
</script>