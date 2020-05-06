import { defineComponent, reactive, toRefs } from "vue";
import { Blocks, BlockList, Item, Items, Coord, ItemList } from "./types";
export * from "./types";

interface Data {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
}

export const enum Confirm {
  CONFIRM_CREATE_ITEM = "confirmCreateItem"
}

function getId(): string {
  return Math.round(Math.random() * 1000000000).toString();
}

export default defineComponent({
  setup(_, { emit }) {
    const data = reactive<Data>({
      blocks: {
        "1": {
          id: "1",
          items: []
        }
      },
      blockList: ["1"],
      items: {},
      itemList: []
    });

    const itemStyle = (item: Item) => {
      return {
        left: item.x + "px",
        top: item.y + "px"
      };
    };

    const createItem = async (params: Record<string, any>) => {
      emit("before-create-item", params);

      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });

      await promiseConfirm;
      const newItem: Item = {
        id: getId(),
        x: Math.random() * 300,
        y: Math.random() * 300
      };
      data.items[newItem.id] = newItem;
      data.itemList.push(newItem.id);
      data.blocks[data.blockList[0]].items.push(newItem.id);

      emit("item-created", {
        newItem,
        ...params
      });

      return newItem;
    };

    const deleteItem = async (params: Record<string, any>) => {
      emit("before-delete-item", params);

      const promiseConfirm = new Promise((res, rej) => {
        if (params.confirm && typeof params.confirm === "function") {
          params.confirm(res, rej);
        } else res();
      });

      await promiseConfirm;

      const item = data.items[params.itemId];
      data.itemList.splice(data.itemList.indexOf(params.itemId), 1);
      delete data.items[params.itemId];
      data.blocks[data.blockList[0]].items.splice(
        data.blocks[data.blockList[0]].items.indexOf(params.itemId),
        1
      );
      emit("item-deleted", params);
      return item;
    };

    const mouseDownItem = (e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      const itemId = target && target.id.replace("item-", "");
      const mouseDownCoord: Coord = {
        x: e.pageX,
        y: e.pageY
      };
      const chosenItem: Item = Object.assign({}, data.items[itemId]);

      const mouseMoveItem = (e: MouseEvent) => {
        if (mouseDownCoord && chosenItem) {
          const moveCoordinate = {
            x: e.pageX - mouseDownCoord.x,
            y: e.pageY - mouseDownCoord.y
          };
          const id = chosenItem.id;
          if (id) {
            data.items[id].x = chosenItem.x + moveCoordinate.x;
            data.items[id].y = chosenItem.y + moveCoordinate.y;
          }
        }
      };

      const mouseUpItem = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveItem);
        document.removeEventListener("mouseup", mouseUpItem);
      };

      document.addEventListener("mousemove", mouseMoveItem);
      document.addEventListener("mouseup", mouseUpItem);
    };

    return {
      ...toRefs(data),
      createItem,
      deleteItem,
      itemStyle,
      mouseDownItem
    };
  }
});
