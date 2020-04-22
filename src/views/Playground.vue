<template>
  <div class="about">
    <h1>This is a playground page</h1>
    <Teleport to="#teleport-target">
      <h1>Playground</h1>
    </Teleport>
    <list :lists="lists" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import List from "@/components/List.vue";

export default defineComponent({
  name: "Playground",
  components: {
    List
  },
  data() {
    return {
      lists: [
        "Albert",
        "Bri1",
        "Supreme",
        "Jun1",
        "FX",
        "UGL",
        "MF",
        "Piktogram",
        "i18n",
        "MV",
        "MP",
        "Jun3"
      ]
    };
  }
});
</script>
