import { Initializer } from "..";
import { Emit } from "../components/ToolbarEditor";
import { getId } from "@/helper";
import { Item } from "@/types/canvas";
import { ItemTypes } from "@/module/canvas-item";
import { ActionName, SourceName } from ".";

export function toolbar({ runAction }: Initializer) {
  const listeners = {
    [Emit.CREATE_IMAGE]: () => {
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
    },
    [Emit.CREATE_TEXT]: () => {
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
    }
  };

  return {
    listeners
  };
}
