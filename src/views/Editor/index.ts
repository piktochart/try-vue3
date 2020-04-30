import { defineComponent } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import CanvasEditorClass from "@/components/CanvasEditor";

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor
  },
  methods: {
    itemCreated(item) {
      console.log(item);
    },
    onClickCreate() {
      (this.$refs.canvasEditor as CanvasEditorClass).createItem();
    }
  }
});
