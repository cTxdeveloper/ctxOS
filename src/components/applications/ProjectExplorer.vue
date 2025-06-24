<template>
  <div class="p-1">
    <!--
      The root node is special.
      We pass an empty string `''` as the initial path,
      as it has no parent.
    -->
    <FileSystemNode :node="fileSystemTree" path="" />
  </div>
</template>

<script setup lang="ts">
import { fileSystemTree } from '../../data/fileSystem'
import FileSystemNode from '../ui-elements/FileSystemNode.vue'
</script>