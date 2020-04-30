<template>
  <div v-for="blockId in blockList" :key="blockId" class="block">
    <template v-for="itemId in blocks[blockId].items">
      <div
        :key="itemId"
        :id="`item-${itemId}`"
        :style="itemStyle(items[itemId])"
        class="item"
        @mousedown="mouseDownItem"
      >
        <img src="~./test.jpg" />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import imageUrl from "./test.jpg";

interface Block {
  id: string;
  items: Array<Item["id"]>;
}

interface Blocks {
  [key: string]: Block;
}

type BlockList = Array<Block["id"]>;

interface Item {
  id: string;
  x: number;
  y: number;
}

interface Items {
  [key: string]: Item;
}

interface Coord {
  x: number;
  y: number;
}

type ItemList = Array<Item["id"]>;

@Options({})
export default class DragDropItem extends Vue {
  private selectedMode = "vue";

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
  private itemList: ItemList = [];
  private blockCount = 1;
  private itemCount = 1;
  private chosenItem: Item | undefined = undefined;
  private mouseDownCoord: Coord | undefined = undefined;

  private performanceFlag = 0;
  private debugTime: number[] = [];

  private initialCoord: { x?: number; y?: number } = {};

  private getId(): string {
    return Math.round(Math.random() * 1000000000).toString();
  }

  private itemStyle(item: Item) {
    return {
      left: item.x + "px",
      top: item.y + "px"
    };
  }

  private mouseDownItem(e: MouseEvent) {
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
</script>

<style lang="scss">
.block {
  width: 800px;
  height: 500px;
  border: 1px solid black;
  margin: auto;
  position: relative;

  .item {
    position: absolute;
    border: 1px solid grey;

    img {
      width: 150px;
      pointer-events: none;
    }
  }
}
</style>
