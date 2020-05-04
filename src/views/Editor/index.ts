import { defineComponent } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { Confirm } from "@/components/CanvasEditor/index.ts";

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor
  },
  mounted() {
    this.$refs.canvasEditor.addConfirmer(
      Confirm.CONFIRM_CREATE_ITEM,
      (res: () => void, rej: () => void) => {
        // do any validation here to confirm if the item is created or not
        setTimeout(res, 1000);
      }
    );
  },
  methods: {
    beforeCreateItem(item) {
      console.log("before create item", item);
    },
    itemCreated(item) {
      console.log("item created!", item);
    },
    onClickCreate() {
      this.$refs.canvasEditor.createItem();
    }
  }
});
