<template>
  <h3>The Test Teleport 2nd</h3>
  <Teleport to="#test-teleport">
    From Test2
  </Teleport>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestTeleport2"
});
</script>
