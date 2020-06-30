<template>
  <div class="d-flex">
    <div class="toolbar-menu p-2">
      Toolbar Icons
    </div>
    <div class="toolbar-content p-2 border-left">
      Toolbar
      <div><button @click="onClickCreateImage">Add image</button></div>
      <div><button @click="onClickCreateText">Add text</button></div>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style scoped>
.toolbar-menu {
  width: 72px;
}

.toolbar-content {
  width: 280px;
}
</style>
