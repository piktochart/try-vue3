<template>
  <div class="container-full">
    <div class="d-flex">
      <div class="toolbar-menu p-2">
        Toolbar Icons
      </div>
      <div class="toolbar-content p-2 border-left">
        Toolbar
        <div><button @click="onClickCreateImage">Add image</button></div>
        <div><button @click="onClickCreateText">Add text</button></div>
      </div>
      <div class="flex-fill border-left">
        <div class="row p-3">
          <div class="col-3">Visual Name</div>
          <div class="col-5 text-center">
            <button :disabled="!refHistory.canUndo" @click="onClickUndo">
              Undo
            </button>
            <button :disabled="!refHistory.canRedo" @click="onClickRedo">
              Redo
            </button>
          </div>
          <div class="col-4 text-right">Publish Tools</div>
        </div>
        <div class="bg-light p-5">
          <canvas-editor
            ref="canvasEditor"
            @mousedown-item="onMouseDownItem"
            @moving-item="onMovingItem"
            @moved-item="onMovedItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./"></script>
<style scoped>
.toolbar-menu {
  width: 72px;
}

.toolbar-content {
  width: 280px;
}
</style>
