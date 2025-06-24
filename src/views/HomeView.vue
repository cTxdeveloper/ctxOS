<template>
  <!-- 
    TEMPORARY DEBUGGING: We are adding a bright red background.
    This will tell us instantly if the HomeView component itself is on the page.
  -->
  <div 
    class="w-screen h-screen" 
  >
    <Desktop />
    <Taskbar />
  </div>
</template>

<script setup lang="ts">
import Desktop from '../components/os/Desktop.vue';
import Taskbar from '../components/os/Taskbar.vue';
</script>