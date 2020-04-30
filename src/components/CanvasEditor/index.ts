import { Vue, Options } from "vue-class-component";
import imageUrl from "./test.jpg";
import {
  Block,
  Blocks,
  BlockList,
  Item,
  Items,
  Coord,
  ItemList
} from "./types";

@Options({})
export default class CanvasEditor extends Vue {
  setup() {
    return;
  }

  private blocks: Blocks = {
    "1": {
      id: "1",
      items: ["1", "2"]
    }
  };
  private blockList: BlockList = ["1"];
  private items: Items = {
    "1": {
      id: "1",
      x: 10,
      y: 20
    },
    "2": {
      id: "2",
      x: 100,
      y: 200
    }
  };
  private itemList: ItemList = ["1", "2"];
  private chosenItem: Item | undefined = undefined;
  private mouseDownCoord: Coord | undefined = undefined;

  public createItem() {
    const newItem: Item = {
      id: this.getId(),
      x: Math.random() * 300,
      y: Math.random() * 300
    };
    this.items[newItem.id] = newItem;
    this.itemList.push(newItem.id);
    this.blocks[this.blockList[0]].items.push(newItem.id);

    this.$emit("item-created", newItem);
  }

  public itemStyle(item: Item) {
    return {
      left: item.x + "px",
      top: item.y + "px"
    };
  }

  public mouseDownItem(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    const itemId = target && target.id.replace("item-", "");
    this.mouseDownCoord = {
      x: e.pageX,
      y: e.pageY
    };
    this.chosenItem = Object.assign({}, this.items[itemId]);
    document.addEventListener("mousemove", this.mouseMoveItem);
    document.addEventListener("mouseup", this.mouseUpItem);
  }

  private getId(): string {
    return Math.round(Math.random() * 1000000000).toString();
  }

  private mouseMoveItem(e: MouseEvent) {
    if (this.mouseDownCoord && this.chosenItem) {
      const moveCoordinate = {
        x: e.pageX - this.mouseDownCoord.x,
        y: e.pageY - this.mouseDownCoord.y
      };
      const id = this.chosenItem.id;
      if (id) {
        this.items[id].x = this.chosenItem.x + moveCoordinate.x;
        this.items[id].y = this.chosenItem.y + moveCoordinate.y;
      }
    }
  }

  private mouseUpItem(e: MouseEvent) {
    this.mouseDownCoord = undefined;
    this.chosenItem = undefined;
    document.removeEventListener("mousemove", this.mouseMoveItem);
    document.removeEventListener("mouseup", this.mouseUpItem);
  }
}
