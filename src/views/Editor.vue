<template>
  <div>
    <Teleport to="#teleport-target">
      <h1>Editor</h1>
    </Teleport>
    <div>
      <h1>Toolbar</h1>
      <div>Create new item: <button @click="onClickCreate">Create</button></div>
    </div>
    <canvas-editor ref="canvasEditor" @item-created="itemCreated" />
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasEditor from "@/components/CanvasEditor/index.vue";

export default {
  name: "Editor",
  components: {
    CanvasEditor
  },
  methods: {
    itemCreated(item) {
      console.log(item);
    },
    onClickCreate() {
      this.$refs.canvasEditor.createItem();
    }
  }
};
</script>
