<template>
  <div v-for="blockId in blockList" :key="blockId" class="block">
    <canvas-item-container
      v-for="itemId in blocks[blockId].items"
      :key="itemId"
      :id="`item-container-${itemId}`"
      v-bind="items[itemId].container"
      @mousedown.prevent="mouseDownItem($event, itemId)"
    >
      <component
        :is="itemComponentMapper(items[itemId].type)"
        v-bind="items[itemId].content"
      />
    </canvas-item-container>
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
}
</style>
