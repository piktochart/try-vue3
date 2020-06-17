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
        <button @click="onClickUndo">Undo</button>
        <button @click="onClickRedo">Redo</button>
      </div>
    </div>
    <canvas-editor
      ref="canvasEditor"
      :blocks="blocks"
      :blockList="blockList"
      :items="items"
      :itemList="itemList"
      @moving-item="onMovingItem"
      @moved-item="onMovedItem"
    />
  </div>
</template>
<script lang="ts" src="./"></script>
