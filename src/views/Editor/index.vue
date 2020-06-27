<template>
  <div>
    <Teleport to="#teleport-target">
      <h1>Editor</h1>
    </Teleport>
    <div>
      <h1>Toolbar</h1>
      <div><button @click="onClickCreateImage">Add image</button></div>
      <div><button @click="onClickCreateText">Add text</button></div>
      <div>
        <button :disabled="!refHistory.canUndo" @click="onClickUndo">
          Undo
        </button>
        <button :disabled="!refHistory.canRedo" @click="onClickRedo">
          Redo
        </button>
      </div>
    </div>
    {{ selectedIds }}
    <canvas-editor
      ref="canvasEditor"
      @mousedown-item="onMouseDownItem"
      @moving-item="onMovingItem"
      @moved-item="onMovedItem"
    />
  </div>
</template>
<script lang="ts" src="./"></script>
