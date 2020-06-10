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
import mitt from "mitt";
import { declareMethods, HistoryActionName } from "./extension";

export interface Action<T = Record<string, any>> {
  name: ActionName | HistoryActionName;
  value: T;
}

export const enum SourceName {
  USER_CLICK_CREATE = "user-click-create",
  USER_MOVING_ITEM = "user-moving-item",
  USER_MOVED_ITEM = "user-moved-item",
  USER_CLICK_HISTORY = "user-click-history"
}

export const enum ActionName {
  CREATE_ITEM = "create-item",
  UPDATE_ITEM = "update-item",
  DELETE_ITEM = "delete-item"
}

export const enum EventName {
  ITEM_CREATED = "item-created",
  ITEM_UPDATED = "item-updated",
  ITEM_DELETED = "item-deleted"
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
    const data = {
      confirm: (res: () => void) => {
        res();
      },
      emitter: mitt()
    };

    return data;
  },
  computed: {
    ...mapState("canvas", ["blocks", "blockList", "items", "itemList"])
  },
  beforeCreate() {
    this.$store.registerModule("canvas", canvasModule);
  },
  created() {
    const methods = declareMethods();
    Object.assign(this, methods);
  },
  mounted() {
    this.initExtension(this);
  },
  beforeUnmount() {
    this.$store.unregisterModule("canvas");
  },
  methods: {
    async runAction(action: Action) {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      this[action.name](action.value, this.runAction);
    },
    async [ActionName.CREATE_ITEM](params: Record<string, any>) {
      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });
      await promiseConfirm;

      const newItem: Item = params.item || {
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
    async [ActionName.UPDATE_ITEM](params: Record<string, any>) {
      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });
      await promiseConfirm;

      const itemToUpdate = params.itemToUpdate;
      const updatedItem = await this.$store.dispatch("canvas/updateItem", {
        itemToUpdate
      });

      this.onItemUpdated({
        ...params,
        updatedItem
      });
      return updatedItem;
    },
    async [ActionName.DELETE_ITEM](params: Record<string, any>) {
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
    onClickCreate() {
      this.runAction({
        name: ActionName.CREATE_ITEM,
        value: {
          item: undefined,
          confirm: this.confirm,
          source: SourceName.USER_CLICK_CREATE
        }
      });
    },
    onClickUndo() {
      this.runAction({
        name: HistoryActionName.UNDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    },
    onClickRedo() {
      this.runAction({
        name: HistoryActionName.REDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    },
    onMovingItem(params: any) {
      const originalItem = params.item;
      this.runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate: {
            ...originalItem,
            x: params.x,
            y: params.y
          },
          confirm: this.confirm,
          source: SourceName.USER_MOVING_ITEM
        }
      });
    },
    onMovedItem(params: any) {
      const originalItem = params.item;
      this.runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate: {
            ...originalItem,
            x: params.x,
            y: params.y
          },
          confirm: this.confirm,
          source: SourceName.USER_MOVED_ITEM
        }
      });
    },
    // Component Triggered Event
    onItemCreated(params: any) {
      this.emitter.emit(EventName.ITEM_CREATED, params);
    },
    onItemUpdated(params: any) {
      this.emitter.emit(EventName.ITEM_UPDATED, params);
    },
    onItemDeleted(params: any) {
      this.emitter.emit(EventName.ITEM_DELETED, params);
    }
  }
});
