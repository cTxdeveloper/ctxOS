<!-- src/components/os/CommandPalette.vue -->
<template>
  <div class="fixed inset-0 bg-black/50 z-[300] flex justify-center items-start pt-24" @click.self="close">
    <div
      v-motion
      :initial="{ opacity: 0, y: -20, scale: 0.95 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 200 } }"
      class="w-full max-w-xl bg-panel rounded-lg shadow-2xl border border-border"
    >
      <div class="p-2 border-b border-border flex items-center gap-2">
        <Search class="w-5 h-5 text-text-secondary" />
        <input
          ref="inputEl"
          v-model="searchTerm"
          type="text"
          placeholder="Type a command or search..."
          class="w-full bg-transparent text-text-primary focus:outline-none"
        />
      </div>
      <div class="p-2 max-h-80 overflow-y-auto">
        <div v-if="filteredCommands.length === 0" class="text-center text-text-secondary p-4">
          No results found.
        </div>
        <ul>
          <li
            v-for="(command, index) in filteredCommands"
            :key="command.title"
            @click="executeCommand(command)"
            :class="['p-2 rounded-md flex items-center gap-3 cursor-pointer', { 'bg-accent1/20': index === selectedIndex }]"
          >
            <component :is="command.icon" class="w-5 h-5 text-text-secondary" />
            <span>{{ command.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOSStore } from '../../store/osStore'
import { useUIStore } from '../../store/uiStore'
import { Search, Github, Linkedin, Mail } from 'lucide-vue-next'

const osStore = useOSStore()
const uiStore = useUIStore()

const inputEl = ref<HTMLInputElement | null>(null)
onMounted(() => inputEl.value?.focus())

const searchTerm = ref('')
const selectedIndex = ref(0) // For keyboard navigation

const allCommands = computed(() => [
  ...osStore.apps.map(app => ({
    type: 'app',
    id: app.id,
    title: `Open: ${app.title}`,
    icon: (osStore.apps.find(a => a.id === app.id) as any).iconComponent, // You need to add iconComponent to App interface
  })),
  { type: 'link', url: 'https://github.com/your-username', title: 'Go to GitHub', icon: Github },
  { type: 'link', url: 'https://linkedin.com/in/your-username', title: 'Go to LinkedIn', icon: Linkedin },
  { type: 'link', url: 'mailto:your.email@example.com', title: 'Send Email', icon: Mail },
]);

const filteredCommands = computed(() => {
  if (!searchTerm.value) return allCommands.value;
  return allCommands.value.filter(cmd =>
    cmd.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const close = () => uiStore.toggleCommandPalette()

const executeCommand = (command: any) => {
  if (command.type === 'app') {
    osStore.openWindow(command.id);
  } else if (command.type === 'link') {
    window.open(command.url, '_blank');
  }
  close();
}
</script>