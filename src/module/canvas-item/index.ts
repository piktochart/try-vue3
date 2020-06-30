import CanvasItemContainer from "./container/component.vue";
import { defineAsyncComponent } from "vue";

export enum ItemTypes {
  IMAGE = "image",
  TEXT = "text"
}

export const itemComponents = {
  CanvasItemContainer,
  CanvasItemImage: defineAsyncComponent(() => import("./image/component.vue")),
  CanvasItemText: defineAsyncComponent(() => import("./text/component.vue"))
};

export const itemComponentMapper = (type: ItemTypes) => {
  switch (type) {
    case ItemTypes.IMAGE:
      return itemComponents.CanvasItemImage;
    case ItemTypes.TEXT:
      return itemComponents.CanvasItemText;
  }
};
