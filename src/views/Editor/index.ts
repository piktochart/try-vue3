import { defineComponent } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { Confirm, Item } from "@/components/CanvasEditor/index.ts";
import { History, HistoryAction, HistoryObject } from "@/module/history";

const enum Action {
  CREATE_ITEM = "create-item",
  DELETE_ITEM = "delete-item"
}

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
    runAction(action: HistoryAction, transactional: boolean) {
      switch (action.name) {
        case Action.CREATE_ITEM: {
          this.$refs.canvasEditor.createItem({
            transactional
          });
          break;
        }
        case Action.DELETE_ITEM: {
          this.$refs.canvasEditor.deleteItem({
            itemId: action.value.id,
            transactional
          });
        }
      }
    },
    beforeCreateItem() {
      console.log("before create item");
    },
    itemCreated({
      item,
      transactional
    }: {
      item: Item;
      transactional: boolean;
    }) {
      if (transactional) {
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
      }
      console.log("item created!", item);
    },
    onClickCreate() {
      this.runAction({ name: Action.CREATE_ITEM, value: null }, true);
    },
    onClickUndo() {
      const historyObject: HistoryObject = this.historyStore.undoHistory();
      if (!historyObject) {
        return;
      }

      const undoAction = historyObject.undo;
      undoAction.forEach(action => {
        this.runAction(action, false);
      });
    },
    onClickRedo() {
      const historyObject: HistoryObject = this.historyStore.redoHistory();
      if (!historyObject) {
        return;
      }

      const redoAction = historyObject.redo;
      redoAction.forEach(action => {
        this.runAction(action, false);
      });
    }
  }
});
