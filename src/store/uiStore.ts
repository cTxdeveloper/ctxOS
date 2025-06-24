// src/store/uiStore.ts
import { defineStore } from 'pinia'

type BootState = 'off' | 'booting' | 'booted'

export const useUIStore = defineStore('ui', {
  state: () => ({
    bootState: 'off' as BootState,
    commandPaletteOpen: false,
  }),
  actions: {
    startBoot() {
      this.bootState = 'booting'
    },
    finishBoot() {
      this.bootState = 'booted'
    },
    toggleCommandPalette() {
      this.commandPaletteOpen = !this.commandPaletteOpen
    }
  },
})