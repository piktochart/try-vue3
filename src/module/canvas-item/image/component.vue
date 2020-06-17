<template>
  <img class="img" :src="url" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Image } from "./types";

type Props = Image;

export default defineComponent({
  name: "CanvasItemImage",
  props: {
    url: {
      type: String,
      required: true
    }
  },
  setup(props: Props) {
    return {
      ...props
    };
  }
});
</script>
<style scoped>
.img {
  width: 100%;
}
</style>
