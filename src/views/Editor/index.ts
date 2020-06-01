import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { canvasModule } from "@/store/canvas";
import {
  Blocks,
  BlockList,
  Item,
  Items,
  Coord,
  ItemList
} from "@/types/canvas";
import { History } from "@/module/history";

interface Action {
  name: ActionName;
  value: Record<string, any>;
}

const enum SourceName {
  USER_CLICK_CREATE = "user-click-create",
  USER_HISTORY_UNDO = "user-history-undo",
  USER_HISTORY_REDO = "user-history-redo"
}

const enum ActionName {
  CREATE_ITEM = "create-item",
  DELETE_ITEM = "delete-item",
  UNDO_HISTORY = "undo-history",
  REDO_HISTORY = "redo-history"
}

function getId(): string {
  return Math.round(Math.random() * 1000000000).toString();
}

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor: CanvasEditor as any
  },
  data() {
    return {
      historyStore: Object.freeze(History<Action>()),
      confirm: (res: () => void) => {
        res();
      }
    };
  },
  computed: {
    ...mapState("canvas", ["blocks", "blockList", "items", "itemList"])
  },
  beforeCreate() {
    this.$store.registerModule("canvas", canvasModule);
  },
  beforeUnmount() {
    this.$store.unregisterModule("canvas");
  },
  methods: {
    async runAction(action: Action) {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      switch (action.name) {
        case ActionName.CREATE_ITEM: {
          return this.createItem(action.value);
        }
        case ActionName.DELETE_ITEM: {
          return this.deleteItem(action.value);
        }
      }
    },
    async createItem(params: Record<string, any>) {
      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });
      await promiseConfirm;

      const newItem: Item = {
        id: getId(),
        x: Math.random() * 300,
        y: Math.random() * 300
      };
      await this.$store.dispatch("canvas/createItem", { newItem });

      this.onItemCreated({
        ...params,
        newItem
      });
      return newItem;
    },
    async deleteItem(params: Record<string, any>) {
      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });
      await promiseConfirm;

      const deletedItem = await this.$store.dispatch("canvas/deleteItem", {
        itemId: params.itemId
      });
      this.onItemDeleted({
        ...params,
        deletedItem
      });
      return deletedItem;
    },
    // User Triggered Event
    async onClickCreate() {
      await this.runAction({
        name: ActionName.CREATE_ITEM,
        value: {
          item: {},
          confirm: this.confirm,
          source: SourceName.USER_CLICK_CREATE
        }
      });
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
    },
    // Component Triggered Event
    onItemCreated(params: any) {
      if (params.source === SourceName.USER_CLICK_CREATE) {
        // generate history for undo/redo creation
        const item = params.newItem;
        const history = this.historyStore.generateHistoryObject();
        history.name = "create-new-item";
        const undoAction: Action = {
          name: ActionName.DELETE_ITEM,
          value: {
            itemId: item.id,
            confirm: this.confirm,
            source: SourceName.USER_HISTORY_UNDO
          }
        };
        history.undo.push(undoAction);
        const redoAction: Action = {
          name: ActionName.CREATE_ITEM,
          value: {
            item,
            confirm: this.confirm,
            source: SourceName.USER_HISTORY_REDO
          }
        };
        history.redo.push(redoAction);
        this.historyStore.saveHistory(history);
      }
    },
    onItemMoving(params: any) {
      const movingItem = params.item;
      this.$store.dispatch("canvas/updateItem", {
        updatedItem: {
          ...movingItem,
          x: params.x,
          y: params.y
        }
      });
    },
    onItemDeleted(params: any) {
      /* coming soon */
    }
  }
});
