<template>
  <div class="p-4 flex flex-col h-full font-primary text-sm">
    <div class="flex-shrink-0 mb-6">
      <h2 class="text-xl text-text-primary mb-1">Theme Studio</h2>
      <p class="text-text-secondary">Customize the look and feel of CtxOS in real-time.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Color Pickers -->
      <div class="space-y-4">
        <h3 class="font-bold text-lg text-text-primary">Core Colors</h3>
        <div v-for="color in themeColors" :key="color.variable" class="flex items-center justify-between">
          <label :for="color.variable" class="text-text-primary">{{ color.name }}</label>
          <input
            :id="color.variable"
            type="color"
            v-model="color.value"
            @input="updateTheme"
            class="bg-panel border-none h-8 w-16 cursor-pointer"
          >
        </div>
        <div class="pt-4 flex gap-2">
            <button @click="saveTheme" class="bg-accent1 text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all">Save Theme</button>
            <button @click="resetToDefault" class="bg-border text-text-primary font-bold py-2 px-4 rounded hover:bg-panel transition-all">Reset to Default</button>
        </div>
      </div>

      <!-- Live Preview -->
      <div>
        <h3 class="font-bold text-lg text-text-primary mb-2">Live Preview</h3>
        <div class="p-4 rounded-lg bg-background border-2 border-border">
          <div class="w-full h-24 bg-panel rounded-md flex items-center justify-center p-4">
            <div class="text-center">
              <h4 class="text-text-primary font-bold">Sample Window</h4>
              <p class="text-text-secondary text-xs">This is a preview</p>
              <button class="mt-2 text-sm bg-accent1 text-background py-1 px-3 rounded">
                Accent Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

interface ThemeColor {
  name: string;
  variable: string;
  value: string;
  defaultValue: string;
}

// Define the colors we want to be themeable
const themeColors = ref<ThemeColor[]>([
  { name: 'Background', variable: '--color-background', value: '#1a1b26', defaultValue: '#1a1b26' },
  { name: 'UI Panels', variable: '--color-panel', value: '#24283b', defaultValue: '#24283b' },
  { name: 'Borders', variable: '--color-border', value: '#3b4261', defaultValue: '#3b4261' },
  { name: 'Primary Text', variable: '--color-text-primary', value: '#c0caf5', defaultValue: '#c0caf5' },
  { name: 'Primary Accent', variable: '--color-accent1', value: '#73daca', defaultValue: '#73daca' },
]);

/**
 * Applies the current color values to the root CSS variables.
 */
const applyTheme = () => {
  themeColors.value.forEach(color => {
    document.documentElement.style.setProperty(color.variable, color.value);
  });
}

/**
 * Saves the current theme configuration to localStorage.
 */
const saveTheme = () => {
  const themeToSave = themeColors.value.map(c => ({ variable: c.variable, value: c.value }));
  localStorage.setItem('ctxos-theme', JSON.stringify(themeToSave));
  toast.success('Theme saved!', { description: 'It will be loaded automatically on your next visit.' });
}

/**

 * Loads a saved theme from localStorage on component mount.
 */
const loadTheme = () => {
  const savedThemeJSON = localStorage.getItem('ctxos-theme');
  if (savedThemeJSON) {
    try {
      const savedTheme = JSON.parse(savedThemeJSON);
      // Create a map for quick lookups
      const savedColorMap = new Map(savedTheme.map((i: any) => [i.variable, i.value]));
      
      themeColors.value.forEach(color => {
        if (savedColorMap.has(color.variable)) {
          color.value = savedColorMap.get(color.variable)!;
        }
      });
      
      applyTheme(); // Apply the loaded theme
      console.log('Custom theme loaded from localStorage.');
    } catch (error) {
      console.error("Failed to parse saved theme:", error);
      localStorage.removeItem('ctxos-theme');
    }
  }
}

/**
 * Resets the colors to their original default values.
 */
const resetToDefault = () => {
    themeColors.value.forEach(color => {
        color.value = color.defaultValue;
    });
    applyTheme();
    localStorage.removeItem('ctxos-theme');
    toast.info('Theme has been reset to default.');
}

// Load and apply the theme as soon as the app starts.
// This is the ideal place to do it, rather than waiting for this component to mount.
// We can achieve this by having a separate composable, but for simplicity,
// we'll rely on this component being implicitly available (or move this to App.vue).
// For now, we will handle it here.
loadTheme();

</script>