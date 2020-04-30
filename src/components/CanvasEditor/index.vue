<template>
  <div v-for="blockId in blockList" :key="blockId" class="block">
    <template v-for="itemId in blocks[blockId].items">
      <div
        :key="itemId"
        :id="`item-${itemId}`"
        :style="itemStyle(items[itemId])"
        class="item"
        @mousedown="mouseDownItem"
      >
        <img src="~./test.jpg" />
      </div>
    </template>
  </div>
</template>
<script lang="ts" src="./"></script>
<style lang="scss">
.block {
  width: 800px;
  height: 500px;
  border: 1px solid black;
  margin: auto;
  position: relative;

  .item {
    position: absolute;
    border: 1px solid grey;

    img {
      width: 150px;
      pointer-events: none;
    }
  }
}
</style>
