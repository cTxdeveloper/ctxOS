<template>
  <div
    class="w-full h-full bg-black/80 text-white font-primary p-2 rounded-md text-sm leading-relaxed"
    @click="focusInput"
  >
    <!-- History of commands and outputs -->
    <div class="overflow-y-auto h-[calc(100%-2rem)]" ref="historyEl">
      <div v-for="(line, index) in history" :key="index">
        <!-- Input line from history -->
        <div v-if="line.type === 'input'" class="flex items-center">
          <span class="text-accent2">ctx@os</span><span class="text-text-primary">:~$</span>
          <span class="ml-2">{{ line.content }}</span>
        </div>
        <!-- Output line from history, rendered as HTML -->
        <div v-else class="whitespace-pre-wrap" v-html="line.content"></div>
      </div>
    </div>

    <!-- Live input line at the bottom -->
    <div class="flex items-center h-8">
      <span class="text-accent2">ctx@os</span><span class="text-text-primary">:~$</span>
      <input
        ref="inputEl"
        v-model="currentInput"
        @keydown.enter="handleCommand"
        @keydown.up.prevent="browseHistory('up')"
        @keydown.down.prevent="browseHistory('down')"
        type="text"
        class="bg-transparent border-none text-white focus:outline-none flex-grow ml-2"
        autofocus
        autocomplete="off"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useOSStore } from '../../store/osStore'
import { useFileSystem } from '../../composables/useFileSystem'

// --- Type Definitions ---
interface HistoryLine {
  type: 'input' | 'output';
  content: string;
}

// --- Store & Composables ---
const osStore = useOSStore()
const { getFileByPath } = useFileSystem()

// --- Refs for DOM elements and state ---
const inputEl = ref<HTMLInputElement | null>(null)
const historyEl = ref<HTMLDivElement | null>(null)

const currentInput = ref('')
const history = ref<HistoryLine[]>([
  { type: 'output', content: `Welcome to CtxOS v3.0 Terminal. Type <span class="text-accent1">'help'</span> to see available commands.` }
])
const commandHistory = ref<string[]>([])
let historyIndex = -1;

// --- Command Logic ---

/**
 * Handles the 'Enter' key press to execute a command.
 */
const handleCommand = () => {
  const input = currentInput.value.trim();
  if (!input) return;

  addToHistory({ type: 'input', content: input });
  commandHistory.value.push(input);
  historyIndex = commandHistory.value.length;

  const [command, ...args] = input.split(' ');
  
  const commandFunction = commands[command.toLowerCase()];
  if (commandFunction) {
    commandFunction(args);
  } else {
    addToHistory({ type: 'output', content: `<span class="text-warning">Command not found:</span> ${command}. Type 'help'.` });
  }

  currentInput.value = '';
}

/**
 * A record mapping command strings to their functions.
 */
const commands: Record<string, (args: string[]) => void> = {
  help: () => {
    addToHistory({ type: 'output', content: `
  <span class="text-accent1">help</span>          - Shows this help message.
  <span class="text-accent1">whoami</span>        - Displays information about me.
  <span class="text-accent1">skills</span>        - Lists my key technical skills.
  <span class="text-accent1">ls</span> [dir]      - Lists files/projects. Try 'ls Projects'.
  <span class="text-accent1">cat</span> [file]    - Displays file content. Try 'cat Projects/about-me.md'.
  <span class="text-accent1">open</span> [app]    - Opens an application. Try 'open explorer' or 'open web3'.
  <span class="text-accent1">socials</span>       - Shows my social media links.
  <span class="text-accent1">clear</span>         - Clears the terminal screen.
    `});
  },
  whoami: () => {
    addToHistory({ type: 'output', content: "ctx // Python | Backend | Security | Frontend" });
  },
  skills: () => {
    addToHistory({ type: 'output', content: `
<span class="text-accent2">Backend:</span>    Python (FastAPI, Django), Node.js, Go, SQL, NoSQL, Docker
<span class="text-accent2">Frontend:</span>   Vue.js, TypeScript, Tailwind CSS, Svelte
<span class="text-accent2">Security:</span>   Pentesting Tools, Network Security, Scripting (Bash, Python)
<span class="text-accent2">Web3:</span>       Ethers.js, Solidity (Basics), Smart Contract Interaction
    `});
  },
  ls: (args) => {
    const path = args.join(' ') || '';
    const node = getFileByPath(path);
    
    if (node && node.type === 'folder' && node.children) {
      const fileList = Object.keys(node.children).map(key => {
        const child = node.children![key];
        return child.type === 'folder' 
          ? `<span class="text-blue-400">${child.name}/</span>` 
          : child.name;
      }).join('    '); // Add spacing between files
      addToHistory({ type: 'output', content: fileList || 'Directory is empty.' });
    } else if (node && node.type === 'file') {
      addToHistory({ type: 'output', content: node.name });
    } else {
      addToHistory({ type: 'output', content: `ls: cannot access '${path}': No such file or directory` });
    }
  },
  cat: (args) => {
    const filePath = args.join(' ');
    if (!filePath) {
      addToHistory({ type: 'output', content: 'Usage: cat [filename]' });
      return;
    }
    const file = getFileByPath(filePath);
    if (file && file.type === 'file') {
      // Sanitize content to prevent accidental HTML injection from markdown
      const sanitizedContent = file.content?.replace(/</g, "<").replace(/>/g, ">");
      addToHistory({ type: 'output', content: sanitizedContent || 'File is empty.' });
    } else {
      addToHistory({ type: 'output', content: `cat: ${filePath}: No such file or directory` });
    }
  },
  open: (args) => {
    const appName = args[0];
    if (!appName) {
      addToHistory({ type: 'output', content: `Usage: open [app_name]. Try 'open explorer' or 'open web3'.` });
      return;
    }
    const app = osStore.apps.find(a => a.id.toLowerCase() === appName.toLowerCase() || a.title.toLowerCase().includes(appName.toLowerCase()));
    if (app) {
      osStore.openWindow(app.id);
      addToHistory({ type: 'output', content: `Opening ${app.title}...` });
    } else {
      addToHistory({ type: 'output', content: `Application '${appName}' not found.` });
    }
  },
  socials: () => {
    addToHistory({ type: 'output', content: `
  <a href="https://github.com/your-username" target="_blank" class="text-accent1 hover:underline">GitHub</a>
  <a href="https://linkedin.com/in/your-username" target="_blank" class="text-accent1 hover:underline">LinkedIn</a>
  <a href="mailto:your.email@example.com" class="text-accent1 hover:underline">Email</a>
    `});
  },
  clear: () => {
    history.value = [];
  },
};

// --- Helper Functions ---

/**
 * Adds a line to the history and scrolls the view to the bottom.
 */
const addToHistory = async (line: HistoryLine) => {
  history.value.push(line);
  await nextTick();
  if (historyEl.value) {
    historyEl.value.scrollTop = historyEl.value.scrollHeight;
  }
}

/**
 * Allows navigating through command history with up/down arrow keys.
 */
const browseHistory = (direction: 'up' | 'down') => {
  if (direction === 'up' && historyIndex > 0) {
    historyIndex--;
  } else if (direction === 'down' && historyIndex < commandHistory.value.length - 1) {
    historyIndex++;
  } else if (direction === 'down' && historyIndex === commandHistory.value.length - 1) {
    historyIndex++;
    currentInput.value = '';
    return;
  } else if (direction === 'up' && historyIndex === -1) {
    // If starting fresh, set index to last command
    historyIndex = commandHistory.value.length -1;
  }

  currentInput.value = commandHistory.value[historyIndex] || '';
}

/**
 * Focuses the input element when the terminal window is clicked.
 */
const focusInput = () => {
  inputEl.value?.focus();
}

onMounted(focusInput);
</script>