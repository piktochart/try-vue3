import CanvasItemContainer from "./container/component.vue";
import CanvasItemImage from "./image/component.vue";

export enum ItemTypes {
  IMAGE = "image"
}

export const itemComponents = {
  CanvasItemContainer,
  CanvasItemImage
};

export const itemComponentMapper = (type: ItemTypes) => {
  switch (type) {
    case ItemTypes.IMAGE:
      return CanvasItemImage;
  }
};
