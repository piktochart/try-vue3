import { defineComponent } from "vue";

export enum Emit {
  CREATE_TEXT = "create-text",
  CREATE_IMAGE = "create-image",
  DRAG_IMAGE = "drag-image"
}

export default defineComponent({
  name: "ToolbarEditor",
  methods: {
    onClickCreateText() {
      this.$emit(Emit.CREATE_TEXT);
    },
    onDragCreateImage(e: DragEvent) {
      this.$emit(Emit.DRAG_IMAGE, e);
    },
    onClickCreateImage() {
      this.$emit(Emit.CREATE_IMAGE);
    }
  }
});
