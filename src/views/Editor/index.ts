import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { canvasModule } from "@/store/canvas";
import { Item } from "@/types/canvas";
import mitt from "mitt";
import {
  declareMethods,
  HistoryActionName,
  HistorySourceName
} from "./extension";

type Confirm<T = Record<string, any>> = (
  arg0: ActionValue<T>,
  arg1: () => void,
  arg2: () => void
) => void;

export type ActionValue<T = Record<string, any>> = {
  source: SourceName | HistorySourceName;
  confirm?: Confirm<T>;
} & T;

export interface ActionParams<T = Record<string, any>> {
  name: ActionName | HistoryActionName;
  value: ActionValue<T>;
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

export type ActionFunction<P = any, R = any> = (
  arg0: ActionValue<P>,
  arg1: (arg0: ActionParams) => Promise<any>
) => Promise<R>;

function getId(): string {
  return Math.round(Math.random() * 1000000000).toString();
}

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor: CanvasEditor as any
  },
  data() {
    const confirm: Confirm = (params, res) => res();
    const data = {
      confirm,
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
    // inject methods from extension to the component. Unfortunately the types aren't inherited
    // we'll see if it makes more sense once migrated to composition API
    Object.assign(this, methods);
  },
  mounted() {
    // typescript failed here since the injected methods from extension aren't registered in the component instance
    this.initExtension(this);
  },
  beforeUnmount() {
    this.$store.unregisterModule("canvas");
  },
  methods: {
    // Middleware Methods
    async runAction(action: ActionParams) {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      return this[action.name](action.value, this.runAction);
    },
    async confirmAction<P>(params: ActionValue<P>) {
      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(params, res, rej);
        } else res();
      });
      await promiseConfirm;
    },
    // Core Actions
    async [ActionName.CREATE_ITEM](params: ActionValue<{ item: Item }>) {
      await this.confirmAction(params);

      const newItem: Item = params.item;

      await this.$store.dispatch("canvas/createItem", { newItem });

      this.emitter.emit(EventName.ITEM_CREATED, {
        ...params,
        newItem
      });
      return newItem;
    },
    async [ActionName.UPDATE_ITEM](
      params: ActionValue<{ itemToUpdate: Item }>
    ) {
      await this.confirmAction(params);

      const itemToUpdate = params.itemToUpdate;
      const updatedItem = await this.$store.dispatch("canvas/updateItem", {
        itemToUpdate
      });

      this.emitter.emit(EventName.ITEM_UPDATED, {
        ...params,
        updatedItem
      });
      return updatedItem;
    },
    async [ActionName.DELETE_ITEM](
      params: ActionValue<{ itemId: Item["id"] }>
    ) {
      await this.confirmAction(params);

      const deletedItem = await this.$store.dispatch("canvas/deleteItem", {
        itemId: params.itemId
      });
      this.emitter.emit(EventName.ITEM_DELETED, {
        ...params,
        deletedItem
      });
      return deletedItem;
    },
    // User Triggered Event
    onClickCreate() {
      const item: Item = {
        id: getId(),
        x: Math.random() * 300,
        y: Math.random() * 300
      };

      this.runAction({
        name: ActionName.CREATE_ITEM,
        value: {
          item,
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
      const originalItem: Item = params.item;
      const itemToUpdate = {
        ...originalItem,
        x: params.x,
        y: params.y
      };
      this.runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate,
          source: SourceName.USER_MOVING_ITEM
        }
      });
    },
    onMovedItem(params: any) {
      const originalItem = params.item;
      const itemToUpdate = {
        ...originalItem,
        x: params.x,
        y: params.y
      };
      this.runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate,
          confirm: this.confirm,
          source: SourceName.USER_MOVED_ITEM
        }
      });
    }
  }
});
