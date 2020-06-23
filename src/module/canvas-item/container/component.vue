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
    },
    tempX: {
      type: Number,
      default: 0
    },
    tempY: {
      type: Number,
      default: 0
    },
    tempW: {
      type: Number,
      default: 0
    },
    tempH: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const containerStyle = computed(() => {
      return {
        left: props.x + props.tempX + "px",
        top: props.y + props.tempY + "px",
        width: props.w + props.tempW + "px",
        height: props.h + props.tempH + "px"
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
