<template>
  <div class="d-flex">
    <div class="toolbar-menu p-2">
      Toolbar Icons
    </div>
    <div class="toolbar-content p-2 border-left">
      Properties
      <div>
        <div class="card">
          <img
            @drag="onDragCreateImage"
            src="~@/assets/test.jpg"
            class="card-img-top thumb"
          />
          <div class="card-body">
            <button class="btn btn-primary" @click="onClickCreateImage">
              Add Image
            </button>
          </div>
        </div>
      </div>
      <div class="card mt-1">
        <div class="card-body">
          <button class="btn btn-primary" @click="onClickCreateText">
            Add text
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="scss" scoped>
.toolbar-menu {
  width: 72px;
}

.toolbar-content {
  width: 280px;
}

.thumb {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
