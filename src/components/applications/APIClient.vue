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
          <!-- THE FIX: The error display is now more user-friendly -->
          <div v-else-if="response.error" class="text-warning whitespace-pre-wrap p-2 bg-warning/10 rounded-md">
            <p class="font-bold mb-2">Request Failed</p>
            {{ response.error }}
          </div>
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

interface ApiRequest {
  method: 'GET' | 'POST';
  url: string;
}

interface ExampleRequest extends ApiRequest {
  name: string;
}

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

const examples: ExampleRequest[] = [
  { name: 'GitHub User', method: 'GET', url: 'https://api.github.com/users/octocat' },
  { name: 'Public APIs List', method: 'GET', url: 'https://api.publicapis.org/entries' },
  { name: 'Fake POST', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts' },
  // Add an example that is likely to fail (CORS error) to show error handling
  { name: 'CORS Fail Example', method: 'GET', url: 'https://google.com' },
];

const loadExample = (example: ExampleRequest) => {
  request.method = example.method;
  request.url = example.url;
}

const sendRequest = async () => {
  isLoading.value = true;
  response.status = null;
  response.statusText = null;
  response.data = null;
  response.error = null;

  if (!request.url.trim()) {
      response.error = "URL cannot be empty.";
      isLoading.value = false;
      return;
  }

  try {
    const res = await fetch(request.url, {
      method: request.method,
      // NOTE: For a real app, you'd need a proxy to get around CORS issues
      // for most APIs. For this portfolio, we stick to APIs that allow open access.
    });

    response.status = res.status;
    response.statusText = res.statusText;
    const responseData = await res.json();
    response.data = JSON.stringify(responseData, null, 2);

    if (!res.ok) {
      console.warn(`Request finished with a non-2xx status: ${res.status}`);
    }

  } catch (err: any) {
    console.error("API Request Error:", err);
    // THE FIX: Provide a more helpful, user-facing error message.
    if (err.message.includes('Failed to fetch')) {
        response.error = `Network Error: Could not resolve the host.\n\nPlease check your internet connection and ensure the domain name is correct.\n\nDetails: ${err.message}`;
    } else {
        response.error = err.message;
    }
  } finally {
    isLoading.value = false;
  }
}

const statusColor = computed(() => {
  if (!response.status) return '';
  if (response.status >= 200 && response.status < 300) return 'bg-accent2/20 text-accent2';
  if (response.status >= 400 && response.status < 500) return 'bg-yellow-400/20 text-yellow-400';
  if (response.status >= 500) return 'bg-warning/20 text-warning';
  return 'bg-border/50 text-text-secondary';
});
</script>