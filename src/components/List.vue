<template>
  <div v-for="list in lists" :key="list" class="list">{{ list }}</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default {
  name: "List",
  props: {
    lists: Array
  }
};
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
