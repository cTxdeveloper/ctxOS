<template>
  <div>
    <StartMenu
      v-if="startMenuOpen"
      @close="startMenuOpen = false"
      v-on-click-outside="() => startMenuOpen = false"
      :style="{ zIndex: 'var(--z-start-menu)' }"
    />
    <footer 
      class="absolute bottom-0 left-0 right-0 h-14 glass-pane flex items-center justify-between px-2" 
      :style="{ zIndex: 'var(--z-taskbar)' }"
    >
      <!-- Left side: Start Button and App Dock -->
      <div class="flex items-center gap-2 h-full">
        <button
          @click="startMenuOpen = !startMenuOpen"
          class="h-full px-3 rounded-md hover:bg-border transition-colors"
          title="Start"
        >
          <Command class="w-6 h-6 text-accent1" />
        </button>

        <div class="w-px h-8 bg-border/50"></div>
        
        <!-- App Dock for open and minimized windows -->
        <div class="flex items-center gap-1 h-full">
          <div
            v-for="win in windows"
            :key="win.id"
            @click="handleTaskbarClick(win)"
            class="h-full px-2 flex items-center gap-2 rounded-md hover:bg-border cursor-pointer relative transition-all duration-200"
            :class="{ 'bg-accent1/20': !win.isMinimized }"
            :title="win.title"
          >
            <!-- THE FIX: The icon container now changes style when minimized -->
            <div 
              class="p-1 rounded-md transition-all duration-200"
              :class="{ 'glass-pane scale-110 !bg-panel/80 shadow-lg': win.isMinimized }"
            >
              <component :is="(icons as any)[(osStore.apps.find(a=>a.id === win.appId) as any).icon]" class="w-6 h-6" />
            </div>
            
            <!-- Show text label only for active (non-minimized) windows -->
            <span v-if="!win.isMinimized" class="text-sm truncate max-w-24">{{ win.title }}</span>

            <!-- Active window indicator bar -->
            <div v-if="!win.isMinimized" class="absolute bottom-0 left-0 w-full h-1 bg-accent1 rounded-b-md"></div>
          </div>
        </div>
      </div>
      
      <!-- Right side: Clock -->
      <Clock />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOSStore, type Window } from '../../store/osStore'
import Clock from '../ui-elements/Clock.vue'
import StartMenu from './StartMenu.vue'
import * as icons from 'lucide-vue-next'
import { Command } from 'lucide-vue-next'
import { vOnClickOutside } from '@vueuse/components'

const osStore = useOSStore()
const { windows } = storeToRefs(osStore)

const startMenuOpen = ref(false)

const handleTaskbarClick = (win: Window) => {
  if (win.isMinimized) {
    osStore.toggleMinimize(win.id)
  } else {
    // If it's the active window, minimize it. Otherwise, focus it.
    if(win.zIndex === osStore.activeZIndex) {
      osStore.toggleMinimize(win.id);
    } else {
      osStore.focusWindow(win.id)
    }
  }
}
</script>