<template>
  <div class="home">
    <drag-drop-element />
    <Teleport to="#teleport-target">
      <h1>Drag and Drop</h1>
    </Teleport>
  </div>
</template>

<script>
// @ is an alias to /src
import DragDropElement from "@/components/DragDropElement/index.vue";

export default {
  name: "DragDrop",
  components: {
    DragDropElement
  }
};
</script>
