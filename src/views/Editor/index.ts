import { defineComponent, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import CanvasEditor from "./components/CanvasEditor/index.vue";
import { canvasModule, State as CanvasState } from "@/store/canvas";
import { Item } from "@/types/canvas";
import mitt from "mitt";
import { useExtension, ActionName, SourceName, EventName } from "./extension";
import { ItemTypes } from "@/module/canvas-item";
import { DeepPartial } from "utility-types";

export type Confirm<T = Record<string, any>> = (
  arg0: ActionParams<T>,
  arg1: (arg0: boolean) => void,
  arg2: () => void
) => void;

export type ActionValue<T = Record<string, any>> = {
  source: SourceName;
} & T;

export interface ActionParams<T = Record<string, any>> {
  name: ActionName;
  value: ActionValue<T>;
  toConfirm?: boolean;
}

export enum CoreSourceName {
  USER_CLICK_CREATE = "user-click-create",
  USER_MOUSEDOWN_ITEM = "user-mousedown-item",
  USER_MOVING_ITEM = "user-moving-item",
  USER_MOVED_ITEM = "user-moved-item",
  USER_CLICK_HISTORY = "user-click-history"
}

export enum CoreActionName {
  CREATE_ITEM = "create-item",
  UPDATE_ITEM = "update-item",
  UPDATE_ITEM_TEMP = "update-item-temp",
  DELETE_ITEM = "delete-item",
  CLEAR_CANVAS = "clear-canvas",
  NEW_SELECTION = "new-selection",
  ADD_SELECTION = "add-selection",
  REMOVE_SELECTION = "remove-selection",
  CLEAR_SELECTION = "clear-selection"
}

export enum CoreEventName {
  ITEM_CREATED = "item-created",
  ITEM_UPDATED = "item-updated",
  ITEM_TEMP_UPDATED = "item-temp-updated",
  ITEM_DELETED = "item-deleted",
  CANVAS_CLEARED = "canvas-cleared",
  ITEM_SELECTED = "item-selected"
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
    name: ActionName,
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
      itemList: computed(() => store.state.canvas.itemList),
      selectedIds: computed(() => store.state.canvas.selectedIds)
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
      ActionName,
      (act: ActionValue) => Promise<any>
    >;
    const registerAction = (
      name: ActionName,
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

    // User Events
    const onClickCreateImage = () => {
      const item: Item = {
        id: getId(),
        container: {
          x: Math.random() * 300,
          y: Math.random() * 300,
          w: 150,
          h: 120
        },
        type: ItemTypes.IMAGE,
        content: {
          url: require("@/assets/test.jpg")
        }
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
    const onClickCreateText = () => {
      const item: Item = {
        id: getId(),
        container: {
          x: Math.random() * 300,
          y: Math.random() * 300,
          w: 100,
          h: 100
        },
        type: ItemTypes.TEXT,
        content: {
          text: "Hello World"
        }
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
        name: ActionName.UNDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    };
    const onClickRedo = () => {
      runAction({
        name: ActionName.REDO_HISTORY,
        value: {
          source: SourceName.USER_CLICK_HISTORY
        }
      });
    };
    const onMouseDownItem = (params: { itemId: Item["id"]; e: MouseEvent }) => {
      const itemId = params.itemId;
      runAction({
        name: ActionName.NEW_SELECTION,
        value: {
          itemId,
          source: SourceName.USER_MOUSEDOWN_ITEM
        }
      });
    };
    const onMovingItem = (params: { x: number; y: number; item: Item }) => {
      const selectedItemId = Object.keys(canvasState.selectedIds.value)[0];
      const originalItem = canvasState.items.value[selectedItemId];
      const itemTempToUpdate: DeepPartial<Item> = {
        id: selectedItemId,
        container: {
          x: originalItem.container.x + params.x,
          y: originalItem.container.y + params.y
        }
      };
      runAction({
        name: ActionName.UPDATE_ITEM_TEMP,
        value: {
          originalItem,
          itemTempToUpdate,
          source: SourceName.USER_MOVING_ITEM
        }
      });
    };
    const onMovedItem = (params: { x: number; y: number; item: Item }) => {
      const selectedItemId = Object.keys(canvasState.selectedIds.value)[0];
      const { temp, ...originalItem } = canvasState.items.value[selectedItemId];
      const itemToUpdate: DeepPartial<Item> = {
        id: selectedItemId,
        container: {
          x: originalItem.container.x + params.x,
          y: originalItem.container.y + params.y
        }
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
    const ext = useExtension({
      emitter,
      props,
      setConfirmAction,
      runAction,
      registerAction
    });

    const toReturn = {
      ...canvasState,
      ...ext,
      onClickCreateImage,
      onClickCreateText,
      onMouseDownItem,
      onClickUndo,
      onClickRedo,
      onMovingItem,
      onMovedItem
    };
    return toReturn;
  }
});
