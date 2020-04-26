<template>
  <h3>The Test Teleport 1st</h3>
  <Teleport to="#test-teleport">
    From Test1
  </Teleport>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestTeleport1"
});
</script>
