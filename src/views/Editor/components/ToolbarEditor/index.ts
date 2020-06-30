import { defineComponent } from "vue";

export enum Emit {
  CREATE_TEXT = "create-text",
  CREATE_IMAGE = "create-image"
}

export default defineComponent({
  name: "ToolbarEditor",
  methods: {
    onClickCreateText() {
      this.$emit(Emit.CREATE_TEXT);
    },
    onClickCreateImage() {
      this.$emit(Emit.CREATE_IMAGE);
    }
  }
});
