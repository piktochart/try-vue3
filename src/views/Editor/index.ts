import { defineComponent, computed, onBeforeUnmount } from "vue";
import { useStore, mapState } from "vuex";
import CanvasEditor from "@/components/CanvasEditor/index.vue";
import { canvasModule, State as CanvasState } from "@/store/canvas";
import { Item } from "@/types/canvas";
import mitt from "mitt";
import {
  declareMethods,
  HistoryActionName,
  HistorySourceName,
  SessionSourceName
} from "./extension";

export type Confirm<T = Record<string, any>> = (
  arg0: ActionParams<T>,
  arg1: (arg0: boolean) => void,
  arg2: () => void
) => void;

export type ActionValue<T = Record<string, any>> = {
  source: SourceName | HistorySourceName | SessionSourceName;
} & T;

export interface ActionParams<T = Record<string, any>> {
  name: ActionName | HistoryActionName;
  value: ActionValue<T>;
  toConfirm?: boolean;
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
  DELETE_ITEM = "delete-item",
  CLEAR_CANVAS = "clear-canvas"
}

export const enum EventName {
  ITEM_CREATED = "item-created",
  ITEM_UPDATED = "item-updated",
  ITEM_DELETED = "item-deleted",
  CANVAS_CLEARED = "canvas-cleared"
}

export type ActionFunction<P = any, R = any> = (
  arg0: ActionValue<P>,
  arg1: (arg0: ActionParams) => Promise<any>
) => Promise<R>;

export interface Initializer {
  emitter: ReturnType<typeof mitt>;
  props: Props;
  setConfirmAction: (confirm: Confirm) => void;
  registerAction: (
    name: ActionName | HistoryActionName,
    func: (params: ActionValue<any>) => Promise<any>
  ) => void;
  runAction: (action: ActionParams) => Promise<any>;
}

export interface Props {
  id: string;
}

function getId(): string {
  return Math.round(Math.random() * 1000000000).toString();
}

export default defineComponent({
  name: "Editor",
  components: {
    CanvasEditor: CanvasEditor as any
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const confirm: Confirm = (params, res) => res(true);
    const data = {
      confirm,
      emitter: mitt()
    };

    return data;
  },
  setup(props, ctx) {
    const store = useStore<{ canvas: CanvasState }>();
    // Store Getters
    const canvasState = {
      blocks: computed(() => store.state.canvas.blocks),
      blockList: computed(() => store.state.canvas.blockList),
      items: computed(() => store.state.canvas.items),
      itemList: computed(() => store.state.canvas.itemList)
    };

    // Register canvas store
    store.registerModule("canvas", canvasModule);
    onBeforeUnmount(() => {
      store.unregisterModule("canvas");
    });

    // Init the emitter
    const emitter = mitt();

    // Init the action confirmer
    let confirmAction: Confirm = (params, res) => res(true);
    const setConfirmAction = (confirm: Confirm) => {
      confirmAction = confirm;
    };

    // Init the action container and runner
    const actions = {} as Record<
      ActionName | HistoryActionName,
      (act: ActionValue) => Promise<any>
    >;
    const registerAction = (
      name: ActionName | HistoryActionName,
      func: (params: ActionValue<any>) => Promise<any>
    ) => {
      if (actions[name]) {
        throw new Error(`Action ${name} already exist!`);
      }
      actions[name] = func;
    };
    const runAction = async (action: ActionParams) => {
      // due to the asynchronous process on each action,
      // it needs the promise queue to ensure all actions run in appropriate order (FIFO)
      if (action.toConfirm) {
        const isConfirm = await new Promise((res, rej) => {
          confirmAction(action, res, rej);
        });
        return isConfirm
          ? actions[action.name](action.value)
          : Promise.resolve();
      } else {
        return actions[action.name](action.value);
      }
    };

    // Init the core actions of the editor
    registerAction(ActionName.CLEAR_CANVAS, async params => {
      await store.dispatch("canvas/clearCanvas");
      emitter.emit(EventName.CANVAS_CLEARED, {
        ...params
      });
    });

    registerAction(
      ActionName.CREATE_ITEM,
      async (params: ActionValue<{ item: Item }>) => {
        const newItem: Item = params.item;
        await store.dispatch("canvas/createItem", { newItem });
        emitter.emit(EventName.ITEM_CREATED, {
          ...params,
          newItem
        });
        return newItem;
      }
    );

    registerAction(
      ActionName.UPDATE_ITEM,
      async (params: ActionValue<{ itemToUpdate: Item }>) => {
        const itemToUpdate = params.itemToUpdate;
        const updatedItem = await store.dispatch("canvas/updateItem", {
          itemToUpdate
        });

        emitter.emit(EventName.ITEM_UPDATED, {
          ...params,
          updatedItem
        });
        return updatedItem;
      }
    );

    registerAction(
      ActionName.DELETE_ITEM,
      async (params: ActionValue<{ itemId: Item["id"] }>) => {
        const deletedItem = await store.dispatch("canvas/deleteItem", {
          itemId: params.itemId
        });
        emitter.emit(EventName.ITEM_DELETED, {
          ...params,
          deletedItem
        });
        return deletedItem;
      }
    );

    // User Events
    const onClickCreate = () => {
      const item: Item = {
        id: getId(),
        x: Math.random() * 300,
        y: Math.random() * 300
      };
      runAction({
        name: ActionName.CREATE_ITEM,
        value: {
          item,
          source: SourceName.USER_CLICK_CREATE
        },
        toConfirm: true
      });
    };
    const onClickUndo = () => {
      runAction({
        name: HistoryActionName.UNDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    };
    const onClickRedo = () => {
      runAction({
        name: HistoryActionName.REDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    };
    const onMovingItem = (params: { x: number; y: number; item: Item }) => {
      const originalItem = params.item;
      const itemToUpdate = {
        ...originalItem,
        x: params.x,
        y: params.y
      };
      runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate,
          source: SourceName.USER_MOVING_ITEM
        }
      });
    };
    const onMovedItem = (params: { x: number; y: number; item: Item }) => {
      const originalItem = params.item;
      const itemToUpdate = {
        ...originalItem,
        x: params.x,
        y: params.y
      };
      runAction({
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate,
          source: SourceName.USER_MOVED_ITEM
        },
        toConfirm: true
      });
    };

    // Init Extensions
    const extMethods = declareMethods();
    extMethods.initExtension({
      emitter,
      props,
      setConfirmAction,
      runAction,
      registerAction
    });

    const toReturn = {
      ...canvasState,
      onClickCreate,
      onClickUndo,
      onClickRedo,
      onMovingItem,
      onMovedItem
    };
    return toReturn;
  }
});
