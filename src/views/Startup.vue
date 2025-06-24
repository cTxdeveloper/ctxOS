<template>
  <div class="bg-black w-screen h-screen flex flex-col items-center justify-center font-primary text-text-primary transition-opacity duration-500" :class="{ 'opacity-0': isFading }">
    <!-- Your Logo Here -->
    <div class="mb-8">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 17L10 11L4 5" stroke="#73daca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19H20" stroke="#c0caf5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h1 class="text-2xl font-bold mt-2">CtxOS</h1>
    </div>

    <!-- Progress Bar -->
    <div class="w-full max-w-xs h-1 bg-panel rounded-full overflow-hidden">
      <div class="h-full bg-accent1 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUIStore } from '../store/uiStore'

const uiStore = useUIStore()
const progress = ref(0)
const isFading = ref(false)

onMounted(() => {
  const loadingInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 5;
    } else {
      clearInterval(loadingInterval);
      // Start fading out 300ms after loading completes
      setTimeout(() => {
        isFading.value = true;
        // Finish the boot process after the fade-out animation
        setTimeout(() => uiStore.finishBoot(), 500);
      }, 300);
    }
  }, 75);
});
</script>