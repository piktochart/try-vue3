<template>
  <div class="modal-wrapper" :style="modalStyle">
    <div class="modal-box">
      <div>
        Value:
        <input
          :value="value"
          @input="e => $emit('update:value', e.target.value)"
        />
      </div>
      <button @click="$emit('update:visible', false)">Close Modal</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModalInput",
  props: {
    visible: Boolean,
    value: String
  },
  computed: {
    modalStyle() {
      return this.visible ? {} : { display: "none" };
    }
  }
});
</script>
<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 400px;
  height: 400px;
  background: white;
}
</style>
