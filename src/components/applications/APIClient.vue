<template>
  <div class="h-full flex flex-col font-primary text-sm">
    <!-- Top Bar: Method, URL, and Send Button -->
    <div class="flex items-center gap-2 p-2 border-b border-border flex-shrink-0">
      <select v-model="request.method" class="bg-panel border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent1">
        <option>GET</option>
        <option>POST</option>
      </select>
      <input
        v-model="request.url"
        type="text"
        placeholder="https://api.github.com/users/octocat"
        class="w-full bg-panel border border-border p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-accent1"
      />
      <button @click="sendRequest" :disabled="isLoading" class="bg-accent1 text-background font-bold py-1.5 px-4 rounded hover:brightness-110 transition-all disabled:opacity-50 flex-shrink-0">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <!-- Main Content: Request Options and Response Area -->
    <div class="flex-grow flex h-[calc(100%-50px)]">
      <!-- Left Panel: Pre-canned Requests -->
      <div class="w-1/3 border-r border-border p-2 overflow-y-auto">
        <h3 class="font-bold text-text-primary mb-2">Examples</h3>
        <ul>
          <li
            v-for="example in examples"
            :key="example.name"
            @click="loadExample(example)"
            class="p-2 rounded-md hover:bg-border cursor-pointer"
          >
            <span class="font-bold text-accent2">{{ example.method }}</span>
            <span class="ml-2 text-text-secondary">{{ example.name }}</span>
          </li>
        </ul>
      </div>

      <!-- Right Panel: Response -->
      <div class="w-2/3 flex flex-col">
        <div class="p-2 border-b border-border flex items-center gap-4">
          <h3 class="font-bold text-text-primary">Response</h3>
          <span v-if="response.status" :class="statusColor" class="font-bold px-2 py-0.5 rounded-full text-xs">
            {{ response.status }} {{ response.statusText }}
          </span>
        </div>
        <div class="flex-grow overflow-auto p-2 bg-black/30">
          <div v-if="isLoading" class="text-text-secondary">Loading response...</div>
          <div v-else-if="response.error" class="text-warning whitespace-pre-wrap">{{ response.error }}</div>
          <!-- The Syntax Highlighter Component -->
          <highlightjs
            v-else-if="response.data"
            language="json"
            :code="response.data"
          />
          <div v-else class="text-text-secondary">Click "Send" to make a request.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// Define the structure for an API request and example
interface ApiRequest {
  method: 'GET' | 'POST';
  url: string;
}

interface ExampleRequest extends ApiRequest {
  name: string;
}

// --- STATE ---
const isLoading = ref(false);
const request = reactive<ApiRequest>({
  method: 'GET',
  url: 'https://api.github.com/users/octocat'
});

const response = reactive({
  status: null as number | null,
  statusText: null as string | null,
  data: null as string | null,
  error: null as string | null,
});

// Example requests for the user to try
const examples: ExampleRequest[] = [
  { name: 'GitHub User', method: 'GET', url: 'https://api.github.com/users/octocat' },
  { name: 'Public APIs List', method: 'GET', url: 'https://api.publicapis.org/entries' },
  { name: 'Fake POST', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts' },
];

// --- METHODS ---

const loadExample = (example: ExampleRequest) => {
  request.method = example.method;
  request.url = example.url;
}

const sendRequest = async () => {
  isLoading.value = true;
  // Reset previous response
  response.status = null;
  response.statusText = null;
  response.data = null;
  response.error = null;

  try {
    const res = await fetch(request.url, {
      method: request.method,
      // For POST requests, you could add a body here
    });

    response.status = res.status;
    response.statusText = res.statusText;

    const responseData = await res.json();
    // Pretty-print the JSON for the highlighter
    response.data = JSON.stringify(responseData, null, 2);

    if (!res.ok) {
      // If the response is not OK, we still show the data but can treat it as an error state
      console.warn(`Request finished with status: ${res.status}`);
    }

  } catch (err: any) {
    console.error("API Request Error:", err);
    response.error = err.message;
  } finally {
    isLoading.value = false;
  }
}

// --- COMPUTED ---

// Dynamically sets the color of the status code badge
const statusColor = computed(() => {
  if (!response.status) return '';
  if (response.status >= 200 && response.status < 300) return 'bg-accent2/20 text-accent2';
  if (response.status >= 400 && response.status < 500) return 'bg-yellow-400/20 text-yellow-400';
  if (response.status >= 500) return 'bg-warning/20 text-warning';
  return 'bg-border/50 text-text-secondary';
});
</script>