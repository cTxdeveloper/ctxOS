import { defineStore } from 'pinia'
import { markRaw, type Component } from 'vue'
import { useFileSystem } from '../composables/useFileSystem'

// --- Application Component Imports ---
import ProfileTerminal from '../components/applications/ProfileTerminal.vue'
import ProjectExplorer from '../components/applications/ProjectExplorer.vue'
import ReadmeViewer from '../components/applications/ReadmeViewer.vue'
import Web3Dashboard from '../components/applications/Web3Dashboard.vue'
import Settings from '../components/applications/Settings.vue'
import APIClient from '../components/applications/APIClient.vue'
import PasswordCracker from '../components/applications/PasswordCracker.vue' // Import the new app

// --- Type Definitions ---
export interface App {
  id: string;
  title: string;
  icon: string; // The name of the Lucide icon component (e.g., 'TerminalSquare')
  component: Component;
}

export interface Window {
  id: string;
  appId: string;
  title: string;
  component: Component;
  appProps: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
}

const { getFileByPath } = useFileSystem()

export const useOSStore = defineStore('os', {
  state: () => ({
    /**
     * A list of all available applications in the OS.
     * This populates the Start Menu and is used to launch windows.
     */
    apps: [
      { id: 'terminal', title: 'Terminal', icon: 'TerminalSquare', component: markRaw(ProfileTerminal) },
      { id: 'explorer', title: 'Explorer', icon: 'Folder', component: markRaw(ProjectExplorer) },
      { id: 'web3', title: 'Web3 Dashboard', icon: 'Wallet', component: markRaw(Web3Dashboard) },
      { id: 'api_client', title: 'API Client', icon: 'Send', component: markRaw(APIClient) },
      
      // THE ADDITION: The new Password Demo app is registered here.
      { id: 'pw_cracker', title: 'Password Demo', icon: 'KeyRound', component: markRaw(PasswordCracker) },
      
      { id: 'settings', title: 'Settings', icon: 'Settings', component: markRaw(Settings) },
      
      // This app is opened by other apps, so it's kept in the registry but
      // could be hidden from the start menu if desired.
      { id: 'viewer', title: 'Viewer', icon: 'FileText', component: markRaw(ReadmeViewer) },
    ] as App[],

    /**
     * A list of all currently open windows on the desktop.
     */
    windows: [] as Window[],
    
    /**
     * Tracks the highest z-index to ensure the focused window is always on top.
     */
    activeZIndex: 100,
  }),

  // --- Actions ---
  // (No changes were needed in the actions logic for this update)
  actions: {
    openWindow(appId: string, props: Record<string, any> = {}) {
      const app = this.apps.find(a => a.id === appId)
      if (!app) {
        console.error(`App with ID '${appId}' not found.`)
        return
      }
      if (props.filePath) {
        const existingWindow = this.windows.find(w => w.appProps.filePath === props.filePath);
        if (existingWindow) {
          this.focusWindow(existingWindow.id);
          if (existingWindow.isMinimized) this.toggleMinimize(existingWindow.id);
          return;
        }
      }
      this.activeZIndex++;
      const newWindow: Window = {
        id: `win_${Date.now()}`,
        appId: app.id,
        title: props.filePath ? props.filePath.split('/').pop()! : app.title,
        component: app.component,
        appProps: props,
        position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
        size: { width: 700, height: 500 },
        zIndex: this.activeZIndex,
        isMinimized: false,
      }
      this.windows.push(newWindow)
    },

    openFile(filePath: string) {
      const file = getFileByPath(filePath);
      if (!file || file.type !== 'file') {
        console.error(`File not found or is a directory: ${filePath}`);
        return;
      }
      const extension = filePath.split('.').pop();
      let appId = 'viewer';
      if (extension === 'md') {
        appId = 'viewer';
      }
      this.openWindow(appId, { filePath, content: file.content });
    },
    
    closeWindow(windowId: string) {
      this.windows = this.windows.filter(w => w.id !== windowId)
    },

    focusWindow(windowId: string) {
      this.activeZIndex++
      const window = this.windows.find(w => w.id === windowId)
      if (window) {
        window.zIndex = this.activeZIndex
      }
    },

    toggleMinimize(windowId: string) {
      const window = this.windows.find(w => w.id === windowId);
      if (window) {
        window.isMinimized = !window.isMinimized;
        if (!window.isMinimized) {
          this.focusWindow(windowId);
        }
      }
    },

    updateWindowPosition(windowId: string, position: { x: number, y: number }) {
      const window = this.windows.find(w => w.id === windowId);
      if (window) {
        window.position = position;
      }
    },

    updateWindowSize(windowId: string, size: { width: number, height: number }) {
      const window = this.windows.find(w => w.id === windowId);
      if (window) {
        window.size = size;
      }
    },
  },
})