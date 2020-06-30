<template>
  <div class="container-full">
    <div class="d-flex">
      <div>
        <toolbar-editor v-on="refToolbar.listeners" />
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
