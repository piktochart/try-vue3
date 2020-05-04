import { defineComponent } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { Confirm, Item } from "@/components/CanvasEditor/index.ts";
import { History, HistoryAction } from "@/module/history";

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor
  },
  data() {
    return {
      historyStore: History()
    };
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
    beforeCreateItem() {
      console.log("before create item");
    },
    itemCreated(item: Item) {
      const history = this.historyStore.generateHistoryObject();
      history.name = "create-new-item";
      const undoAction: HistoryAction = {
        name: "delete-item",
        value: {
          id: item.id
        }
      };
      history.undo.push(undoAction);
      const redoAction: HistoryAction = {
        name: "create-item",
        value: {
          item
        }
      };
      history.redo.push(redoAction);
      this.historyStore.saveHistory(history);

      console.log("item created!", item);
    },
    onClickCreate() {
      this.$refs.canvasEditor.createItem();
    }
  }
});
