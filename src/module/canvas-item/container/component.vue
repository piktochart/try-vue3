<template>
  <div class="container" :style="containerStyle">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, Prop, computed } from "vue";
import { ItemContainer } from "./types";
import { ItemTypes } from "..";

type Props = ItemContainer;

export default defineComponent({
  name: "CanvasItemContainer",
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    w: {
      type: Number,
      required: true
    },
    h: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const containerStyle = computed(() => {
      return {
        left: props.x + "px",
        top: props.y + "px",
        width: props.w + "px",
        height: props.h + "px"
      };
    });

    return {
      containerStyle
    };
  }
});
</script>
<style scoped>
.container {
  position: absolute;
}
</style>
