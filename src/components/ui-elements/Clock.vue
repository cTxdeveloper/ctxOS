<!-- src/components/ui-elements/Clock.vue -->
<template>
  <div class="flex flex-col items-center justify-center text-sm font-primary text-text-primary px-3">
    <span>{{ time }}</span>
    <span class="text-xs text-text-secondary">{{ date }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNow } from '@vueuse/core'

const now = useNow({ interval: 1000 }) // Updates every second

const time = ref('')
const date = ref('')

let intervalId: number | undefined;

const updateDateTime = () => {
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const optionsDate: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };

  time.value = new Intl.DateTimeFormat('en-US', optionsTime).format(now.value);
  date.value = new Intl.DateTimeFormat('en-US', optionsDate).format(now.value);
}

onMounted(() => {
  updateDateTime();
  intervalId = window.setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>