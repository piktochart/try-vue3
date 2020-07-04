import { Initializer } from "..";
import { Emit } from "../components/ToolbarEditor";
import { getId } from "@/helper";
import { Item } from "@/types/canvas";
import { ItemTypes } from "@/module/canvas-item";
import { ActionName, SourceName, EventName } from ".";
import { markRaw, reactive } from "vue";

interface ToolbarState {
  draggedImage: null | string;
}

export function toolbar({ runAction, emitter }: Initializer) {
  const toolbarState = reactive<ToolbarState>({
    draggedImage: null
  });

  const createImage = () => {
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
      }
    });
  };

  const createText = () => {
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
      }
    });
  };

  const dragImage = (e: DragEvent) => {
    toolbarState.draggedImage = (e.target as HTMLImageElement).src;
  };

  emitter.on(EventName.DROPPED_ON_BLOCK, (e: DragEvent) => {
    if (toolbarState.draggedImage) {
      const size = {
        w: 150,
        h: 120
      };
      const location = {
        x: e.offsetX - size.w / 2,
        y: e.offsetY - size.h / 2
      };
      const url = toolbarState.draggedImage;
      toolbarState.draggedImage = null;
      const item: Item = {
        id: getId(),
        container: {
          ...location,
          ...size
        },
        type: ItemTypes.IMAGE,
        content: {
          url
        }
      };
      runAction({
        name: ActionName.CREATE_ITEM,
        value: {
          item,
          source: SourceName.USER_CLICK_CREATE
        }
      });
    }
  });

  const listeners = markRaw({
    [Emit.CREATE_IMAGE]: createImage,
    [Emit.CREATE_TEXT]: createText,
    [Emit.DRAG_IMAGE]: dragImage
  });

  return {
    listeners
  };
}
