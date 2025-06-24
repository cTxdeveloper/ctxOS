<template>
  <div
    ref="windowEl"
    v-motion
    :initial="{ opacity: 0, scale: 0.9, y: 50 }"
    :enter="{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25, mass: 0.5 } }"
    :class="[
      'absolute flex flex-col glass-pane', 
      { 'minimized-window': isMinimized }, // Use the new class
      { 'focused': isFocused }  
    ]"
    :style="windowStyle"
    @mousedown="onMouseDown"
  >
    <div ref="headerEl" class="window-header">
      <div class="flex items-center gap-2">
        <component :is="appIcon" class="w-4 h-4 text-accent1" />
        <span class="font-primary text-sm font-bold truncate">{{ title }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button @click.stop="onMinimize" class="w-4 h-4 rounded-full bg-yellow-400 hover:brightness-125 transition-all"></button>
        <button @click.stop="onClose" class="w-4 h-4 rounded-full bg-warning hover:brightness-125 transition-all"></button>
      </div>
    </div>

    <div class="flex-grow p-2 overflow-auto" :style="{ pointerEvents: isDragging || isResizing ? 'none' : 'auto' }">
      <component :is="appComponent" v-bind="appProps" />
    </div>

    <div
      v-for="handle in resizeHandles"
      :key="handle"
      :class="['absolute z-10', getResizeHandleClass(handle)]"
      @mousedown.stop="startResize($event, handle)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDraggable } from '@vueuse/core'
import { useOSStore } from '../../store/osStore'
import * as icons from 'lucide-vue-next'

const props = defineProps<{
  id: string
  appId: string
  title: string
  appComponent: any
  appProps: Record<string, any> 
  position: { x: number, y: number }
  size: { width: number, height: number }
  zIndex: number
  isMinimized: boolean
}>()

const osStore = useOSStore()

const isFocused = computed(() => props.zIndex === osStore.activeZIndex)

const windowEl = ref<HTMLElement | null>(null)
const headerEl = ref<HTMLElement | null>(null)
const isResizing = ref(false)

const { x, y, isDragging } = useDraggable(windowEl, {
  initialValue: { x: props.position.x, y: props.position.y },
  handle: headerEl,
  onEnd: () => {
    osStore.updateWindowPosition(props.id, { x: x.value, y: y.value })
  },
})

const windowStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  width: `${props.size.width}px`,
  height: `${props.size.height}px`,
  zIndex: props.zIndex,
}))

const appIcon = computed(() => {
  const app = osStore.apps.find(a => a.id === props.appId)
  return app && (icons as any)[app.icon] ? (icons as any)[app.icon] : (icons as any)['AppWindow']
})

const onMouseDown = () => osStore.focusWindow(props.id)
const onClose = () => osStore.closeWindow(props.id)
const onMinimize = () => osStore.toggleMinimize(props.id)

const resizeHandles = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br']

const getResizeHandleClass = (handle: string): string => {
  const base = 'absolute z-10';
  switch (handle) {
    case 't': return `${base} top-0 left-0 w-full h-1.5 cursor-n-resize`;
    case 'b': return `${base} bottom-0 left-0 w-full h-1.5 cursor-s-resize`;
    case 'l': return `${base} top-0 left-0 h-full w-1.5 cursor-w-resize`;
    case 'r': return `${base} top-0 right-0 h-full w-1.5 cursor-e-resize`;
    case 'tl': return `${base} top-0 left-0 w-3 h-3 cursor-nw-resize`;
    case 'tr': return `${base} top-0 right-0 w-3 h-3 cursor-ne-resize`;
    case 'bl': return `${base} bottom-0 left-0 w-3 h-3 cursor-sw-resize`;
    case 'br': return `${base} bottom-0 right-0 w-3 h-3 cursor-se-resize`;
    default: return '';
  }
}

const startResize = (startEvent: MouseEvent, handle: string) => {
  isResizing.value = true;
  const startX = startEvent.clientX, startY = startEvent.clientY, startWidth = props.size.width, startHeight = props.size.height, startPosX = x.value, startPosY = y.value;
  const doDrag = (dragEvent: MouseEvent) => {
    const deltaX = dragEvent.clientX - startX, deltaY = dragEvent.clientY - startY;
    let newWidth = startWidth, newHeight = startHeight, newX = startPosX, newY = startPosY;
    const minWidth = 350, minHeight = 250;
    if (handle.includes('r')) newWidth = Math.max(minWidth, startWidth + deltaX);
    if (handle.includes('l')) { newWidth = Math.max(minWidth, startWidth - deltaX); newX = startPosX + deltaX; }
    if (handle.includes('b')) newHeight = Math.max(minHeight, startHeight + deltaY);
    if (handle.includes('t')) { newHeight = Math.max(minHeight, startHeight - deltaY); newY = startPosY + deltaY; }
    osStore.updateWindowSize(props.id, { width: newWidth, height: newHeight });
    osStore.updateWindowPosition(props.id, { x: newX, y: newY });
    x.value = newX;
    y.value = newY;
  };
  const stopDrag = () => {
    isResizing.value = false;
    window.removeEventListener('mousemove', doDrag);
    window.removeEventListener('mouseup', stopDrag, { once: true });
  };
  window.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', stopDrag);
};
</script>