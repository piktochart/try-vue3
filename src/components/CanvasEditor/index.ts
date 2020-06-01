import { defineComponent, toRefs } from "vue";
import {
  Blocks,
  BlockList,
  Item,
  Items,
  Coord,
  ItemList
} from "@/types/canvas";

interface Props {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
}

export const enum Confirm {
  CONFIRM_CREATE_ITEM = "confirmCreateItem"
}

export default defineComponent({
  props: {
    blocks: Object,
    blockList: Array,
    items: Object,
    itemList: Array
  },
  setup(props: Props, { emit }) {
    const itemStyle = (item: Item) => {
      return {
        left: item.x + "px",
        top: item.y + "px"
      };
    };

    const mouseDownItem = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      const itemId = target && target.id.replace("item-", "");
      const mouseDownCoord: Coord = {
        x: e.pageX,
        y: e.pageY
      };
      const chosenItem: Item = Object.assign({}, props.items[itemId]);
      const mouseMoveItem = (e: MouseEvent) => {
        if (mouseDownCoord && chosenItem) {
          const moveCoordinate = {
            x: e.pageX - mouseDownCoord.x,
            y: e.pageY - mouseDownCoord.y
          };
          const id = chosenItem.id;
          if (id) {
            emit("item-moving", {
              item: chosenItem,
              x: chosenItem.x + moveCoordinate.x,
              y: chosenItem.y + moveCoordinate.y
            });
          }
        }
      };

      const mouseUpItem = (e: MouseEvent) => {
        if (mouseDownCoord && chosenItem) {
          const moveCoordinate = {
            item: chosenItem,
            x: e.pageX - mouseDownCoord.x,
            y: e.pageY - mouseDownCoord.y
          };
          const id = chosenItem.id;
          if (id) {
            emit("item-moved", {
              item: chosenItem,
              x: chosenItem.x + moveCoordinate.x,
              y: chosenItem.y + moveCoordinate.y
            });
          }
        }
        document.removeEventListener("mousemove", mouseMoveItem);
        document.removeEventListener("mouseup", mouseUpItem);
      };

      document.addEventListener("mousemove", mouseMoveItem);
      document.addEventListener("mouseup", mouseUpItem);
    };

    return {
      ...toRefs(props),
      itemStyle,
      mouseDownItem
    };
  }
});
