import { defineComponent, computed, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import CanvasEditor from "./components/CanvasEditor/index.vue";
import ToolbarEditor from "./components/ToolbarEditor/index.vue";
import { canvasModule, State as CanvasState } from "@/store/canvas";
import { Item } from "@/types/canvas";
import mitt from "mitt";
import { usePlugin, ActionName, SourceName } from "./plugin";
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

export default defineComponent({
  name: "Editor",
  components: {
    // TODO: Add any as there's type error on using imported component
    CanvasEditor: CanvasEditor as any,
    ToolbarEditor: ToolbarEditor as any
  },
  props: {
    id: {
      type: String,
      required: true
    }
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
    let confirmAction: Confirm = (_, res) => res(true);
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
      // TODO: due to the asynchronous process on each action,
      // we need a promise queue to ensure all actions run in appropriate order (FIFO)
      const isConfirm = await new Promise<boolean>((res, rej) => {
        confirmAction(action, res, rej);
      });
      return isConfirm ? actions[action.name](action.value) : Promise.resolve();
    };

    // User Events
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
        }
      });
    };

    // Init Plugins
    const pluginRef = usePlugin({
      emitter,
      props,
      setConfirmAction,
      runAction,
      registerAction
    });

    const toReturn = {
      ...pluginRef,
      onMouseDownItem,
      onClickUndo,
      onClickRedo,
      onMovingItem,
      onMovedItem
    };
    return toReturn;
  }
});
