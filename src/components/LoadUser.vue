<template>
  <h3>Bonjour, {{ user }}!</h3>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadUser",
  async setup() {
    const user = await new Promise(res => {
      setTimeout(() => res("Albert"), 5000);
    });
    return {
      user
    };
  }
});
</script>
<style lang="scss" scoped>
.list {
  display: inline-block;
  margin: 5px;
  border: 1px solid black;
  box-shadow: 1px 1px 1px grey;
  font-size: 20px;
  width: 150px;
}
</style>
