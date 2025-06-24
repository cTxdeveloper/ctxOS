import { fileSystemTree, type FileSystemNode } from '../data/fileSystem'

export function useFileSystem() {
  const getFileByPath = (path: string): FileSystemNode | null => {
    // FIX: Remove the root directory name from the start of the path if it exists
    const correctedPath = path.startsWith(`${fileSystemTree.name}/`) 
      ? path.substring(fileSystemTree.name.length + 1)
      : path;
      
    const parts = correctedPath.split('/').filter(p => p);
    // Start searching from the root's children, not the root itself
    let currentNode: FileSystemNode | Record<string, FileSystemNode> = fileSystemTree.children!;

    for (const part of parts) {
      if (typeof currentNode === 'object' && currentNode !== null && (currentNode as any)[part]) {
        currentNode = (currentNode as any)[part];
      } else {
        return null; // Path segment not found
      }
    }
    return currentNode as FileSystemNode;
  }
  return { getFileByPath }
}