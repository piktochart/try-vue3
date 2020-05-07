import { defineComponent } from "vue";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { History } from "@/module/history";

interface Action {
  name: ActionName;
  value: Record<string, any>;
}

const enum ActionName {
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
      historyStore: Object.freeze(History<Action>())
    };
  },
  methods: {
    async runAction(action: Action) {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      switch (action.name) {
        case ActionName.CREATE_ITEM: {
          return this.$refs.canvasEditor.createItem(action.value);
        }
        case ActionName.DELETE_ITEM: {
          return this.$refs.canvasEditor.deleteItem(action.value);
        }
      }
    },
    async onClickCreate() {
      const item = await this.runAction({
        name: ActionName.CREATE_ITEM,
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
      const undoAction: Action = {
        name: ActionName.DELETE_ITEM,
        value: {
          itemId: item.id,
          confirm(res: () => void) {
            setTimeout(res, 1000);
          }
        }
      };
      history.undo.push(undoAction);
      const redoAction: Action = {
        name: ActionName.CREATE_ITEM,
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
