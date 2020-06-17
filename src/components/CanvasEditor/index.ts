import { defineComponent, toRefs } from "vue";
import { Blocks, BlockList, Item, Items, ItemList } from "@/types/canvas";
import {
  ItemTypes,
  itemComponents,
  itemComponentMapper
} from "@/module/canvas-item";

interface Props {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
}

export default defineComponent({
  name: "CanvasEditor",
  components: {
    ...(itemComponents as any)
  },
  props: {
    blocks: {
      type: Object,
      required: true
    },
    blockList: {
      type: Array,
      required: true
    },
    items: {
      type: Object,
      required: true
    },
    itemList: {
      type: Array,
      required: true
    }
  },
  setup(props: Props, { emit }) {
    const mouseDownItem = (e: MouseEvent, itemId: Item["id"]) => {
      const mouseDownCoord = {
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
            emit("moving-item", {
              item: chosenItem,
              x: chosenItem.container.x + moveCoordinate.x,
              y: chosenItem.container.y + moveCoordinate.y
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
            emit("moved-item", {
              item: chosenItem,
              x: chosenItem.container.x + moveCoordinate.x,
              y: chosenItem.container.y + moveCoordinate.y
            });
          }
        }
        document.removeEventListener("mousemove", mouseMoveItem);
        document.removeEventListener("mouseup", mouseUpItem);
      };

      document.addEventListener("mousemove", mouseMoveItem);
      document.addEventListener("mouseup", mouseUpItem);
    };

    const itemTypes = ItemTypes;

    return {
      ...props,
      mouseDownItem,
      itemComponentMapper
    };
  }
});
