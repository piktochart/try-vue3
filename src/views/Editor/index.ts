import { defineComponent, ComponentPublicInstance } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { History, HistoryAction } from "@/module/history";

const enum Action {
  CREATE_ITEM = "create-item",
  DELETE_ITEM = "delete-item"
}

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor: CanvasEditor as any
  },
  data() {
    return {
      historyStore: History()
    };
  },
  methods: {
    async runAction(action: HistoryAction) {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      switch (action.name) {
        case Action.CREATE_ITEM: {
          return this.$refs.canvasEditor.createItem(action.value);
        }
        case Action.DELETE_ITEM: {
          return this.$refs.canvasEditor.deleteItem(action.value);
        }
      }
    },
    async onClickCreate() {
      const item = await this.runAction({
        name: Action.CREATE_ITEM,
        value: {
          item: {},
          confirm(res: () => void) {
            setTimeout(res, 1000);
          }
        }
      });
      // generate history for undo/redo creation
      const history = this.historyStore.generateHistoryObject();
      history.name = "create-new-item";
      const undoAction: HistoryAction = {
        name: Action.DELETE_ITEM,
        value: {
          itemId: item.id,
          confirm(res: () => void) {
            setTimeout(res, 1000);
          }
        }
      };
      history.undo.push(undoAction);
      const redoAction: HistoryAction = {
        name: Action.CREATE_ITEM,
        value: {
          item,
          confirm(res: () => void) {
            setTimeout(res, 1000);
          }
        }
      };
      history.redo.push(redoAction);
      this.historyStore.saveHistory(history);
    },
    onClickUndo() {
      const historyObject = this.historyStore.undoHistory();
      if (!historyObject) {
        return;
      }

      const undoAction = historyObject.undo;
      undoAction.forEach(action => {
        this.runAction(action);
      });
    },
    onClickRedo() {
      const historyObject = this.historyStore.redoHistory();
      if (!historyObject) {
        return;
      }

      const redoAction = historyObject.redo;
      redoAction.forEach(action => {
        this.runAction(action);
      });
    }
  }
});
