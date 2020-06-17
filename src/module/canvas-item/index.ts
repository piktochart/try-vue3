import CanvasItemContainer from "./container/component.vue";
import CanvasItemImage from "./image/component.vue";
import CanvasItemText from "./text/component.vue";

export enum ItemTypes {
  IMAGE = "image",
  TEXT = "text"
}

export const itemComponents = {
  CanvasItemContainer,
  CanvasItemImage,
  CanvasItemText
};

export const itemComponentMapper = (type: ItemTypes) => {
  switch (type) {
    case ItemTypes.IMAGE:
      return "CanvasItemImage";
    case ItemTypes.TEXT:
      return "CanvasItemText";
  }
};
