// src/data/fileSystem.ts
export interface FileSystemNode {
  type: 'folder' | 'file'
  name: string
  content?: string
  children?: Record<string, FileSystemNode>
}

export const fileSystemTree: FileSystemNode = {
  type: 'folder',
  name: 'ctx@os',
  children: {
    'Projects': {
      type: 'folder',
      name: 'Projects',
      children: {
        'ctx-os': {
          type: 'folder',
          name: 'ctx-os',
          children: {
            'README.md': {
              type: 'file',
              name: 'README.md',
              content: '# CtxOS v2\n\nThis is the portfolio you are currently viewing. It is built with Vue.js, TypeScript, and Tailwind CSS.\n\n### Features\n\n- Draggable & Resizable Windows\n- Command Palette\n- Simulated File System',
            },
          },
        },
        'pentesting-tool.py': {
            type: 'file',
            name: 'pentesting-tool.py',
            content: '# A Python script for a cool tool I built...'
        }
      },
    },
    'about-me.md': {
      type: 'file',
      name: 'about-me.md',
      content: '# About Me (ctx)\n\nI am a developer with a passion for...\n\n* Python\n* Backend Systems\n* Cyber Security (Offensive & Defensive)',
    },
  },
}