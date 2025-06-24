import { defineStore } from 'pinia'
import { markRaw, type Component } from 'vue'
import { useFileSystem } from '../composables/useFileSystem'

// --- Application Component Imports ---
import ProfileTerminal from '../components/applications/ProfileTerminal.vue'
import ProjectExplorer from '../components/applications/ProjectExplorer.vue'
import ReadmeViewer from '../components/applications/ReadmeViewer.vue'
import Web3Dashboard from '../components/applications/Web3Dashboard.vue'
import Settings from '../components/applications/Settings.vue'

// --- Type Definitions ---
export interface App {
  id: string;
  title: string;
  icon: string;
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
  state: () => {
    // A helper to safely get CSS variables, with a fallback.
    const getCssVar = (varName: string, fallback: number): number => {
      if (typeof window === 'undefined') return fallback;
      const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
      return value ? parseInt(value) : fallback;
    };
    
    return {
      apps: [
        { id: 'terminal', title: 'Terminal', icon: 'TerminalSquare', component: markRaw(ProfileTerminal) },
        { id: 'explorer', title: 'Explorer', icon: 'Folder', component: markRaw(ProjectExplorer) },
        { id: 'web3', title: 'Web3 Dashboard', icon: 'Wallet', component: markRaw(Web3Dashboard) },
        { id: 'settings', title: 'Settings', icon: 'Settings', component: markRaw(Settings) },
        { id: 'viewer', title: 'Viewer', icon: 'FileText', component: markRaw(ReadmeViewer) },
      ] as App[],
      windows: [] as Window[],
      
      // THE FIX: The base z-index for windows is now centrally managed via CSS.
      activeZIndex: getCssVar('--z-windows-base', 100),
    }
  },
  
  actions: {
    openWindow(appId: string, props: Record<string, any> = {}) {
      const app = this.apps.find(a => a.id === appId);
      if (!app) return;
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
      };
      this.windows.push(newWindow);
    },
    openFile(filePath: string) {
      const file = getFileByPath(filePath);
      if (!file || file.type !== 'file') {
        console.error(`File not found or is a directory: ${filePath}`);
        return;
      }
      const extension = filePath.split('.').pop();
      let appId = 'viewer';
      if (extension === 'md') appId = 'viewer';
      this.openWindow(appId, { filePath, content: file.content });
    },
    closeWindow(windowId: string) {
      this.windows = this.windows.filter(w => w.id !== windowId);
    },
    focusWindow(windowId: string) {
      this.activeZIndex++;
      const window = this.windows.find(w => w.id === windowId);
      if (window) {
        window.zIndex = this.activeZIndex;
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
});