<template>
  <div class="select-none font-primary text-sm">
    <div
      @click="toggleOrOpenFile"
      class="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-border/50 transition-colors"
      :title="fullPath"
    >
      <component :is="icon" class="w-4 h-4 text-accent2 flex-shrink-0" />
      <span class="truncate">{{ node.name }}</span>
    </div>

    <div
      v-if="isOpen && node.type === 'folder' && node.children"
      class="ml-4 border-l-2 border-border/30 pl-2"
    >
      <FileSystemNode
        v-for="child in node.children"
        :key="child.name"
        :node="child"
        :path="fullPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FileSystemNode as FSNodeType } from '../../data/fileSystem'
import { useOSStore } from '../../store/osStore'
import * as icons from 'lucide-vue-next'

const props = defineProps<{
  node: FSNodeType,
  path: string
}>()

const osStore = useOSStore()
const isOpen = ref(props.path === '')

const fullPath = computed(() => {
  return props.path ? `${props.path}/${props.node.name}` : props.node.name
})

const icon = computed(() => {
  if (props.node.type === 'folder') {
    return isOpen.value ? icons['FolderOpen'] : icons['Folder']
  }
  
  const extension = props.node.name.split('.').pop()
  switch (extension) {
    case 'py':
      return icons['FileCode']
    case 'md':
      return icons['FileText']
    default:
      return icons['File']
  }
})

const toggleOrOpenFile = () => {
  if (props.node.type === 'folder') {
    isOpen.value = !isOpen.value
  } else {
    osStore.openFile(fullPath.value)
  }
}
</script>