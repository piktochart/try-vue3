<template>
  <div>
    <Teleport to="#teleport-target">
      <h1>Editor</h1>
    </Teleport>
    <canvas-editor />
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasEditor from "@/components/CanvasEditor/index.vue";

export default {
  name: "Editor",
  components: {
    CanvasEditor
  }
};
</script>
