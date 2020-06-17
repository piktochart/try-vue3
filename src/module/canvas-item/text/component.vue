<template>
  <div>{{ text }}</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Text } from "./types";

type Props = Text;

export default defineComponent({
  name: "CanvasItemImage",
  props: {
    text: {
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
