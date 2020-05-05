import { defineComponent, reactive, toRefs } from "vue";
import { Blocks, BlockList, Item, Items, Coord, ItemList } from "./types";
export * from "./types";

interface Data {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
  confirm: Record<string, any>;
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
      itemList: [],
      confirm: {
        [Confirm.CONFIRM_CREATE_ITEM]: (res: () => void) => res()
      }
    });

    const itemStyle = (item: Item) => {
      return {
        left: item.x + "px",
        top: item.y + "px"
      };
    };

    const addConfirmer = (name: Confirm, callback: () => void) => {
      data.confirm[name] = callback;
    };

    const createItem = async ({
      transactional
    }: {
      transactional: boolean;
    }) => {
      emit("before-create-item", { transactional });

      const promiseConfirm = new Promise((res, rej) => {
        data.confirm[Confirm.CONFIRM_CREATE_ITEM](res, rej);
      });

      return promiseConfirm.then(() => {
        const newItem: Item = {
          id: getId(),
          x: Math.random() * 300,
          y: Math.random() * 300
        };
        data.items[newItem.id] = newItem;
        data.itemList.push(newItem.id);
        data.blocks[data.blockList[0]].items.push(newItem.id);

        emit("item-created", {
          item: newItem,
          transactional
        });

        return newItem;
      });
    };

    const deleteItem = async ({
      itemId,
      transactional
    }: {
      itemId: Item["id"];
      transactional: boolean;
    }) => {
      emit("before-delete-item", { transactional });

      const item = data.items[itemId];
      data.itemList.splice(data.itemList.indexOf(itemId), 1);
      delete data.items[itemId];
      data.blocks[data.blockList[0]].items.splice(
        data.blocks[data.blockList[0]].items.indexOf(itemId),
        1
      );

      emit("item-deleted", { item, transactional });

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
      addConfirmer,
      createItem,
      deleteItem,
      itemStyle,
      mouseDownItem
    };
  }
});
