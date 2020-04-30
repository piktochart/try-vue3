<template>
  <div v-for="blockId in blockList" :key="blockId" class="block">
    <template v-for="elementId in blocks[blockId].elements">
      <div
        :key="elementId"
        :id="`element-${elementId}`"
        :style="elementStyle(elements[elementId])"
        class="element"
        @mousedown="mouseDownElement"
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
  elements: Array<Element["id"]>;
}

interface Blocks {
  [key: string]: Block;
}

type BlockList = Array<Block["id"]>;

interface Element {
  id: string;
  elm?: HTMLElement;
  x: number;
  y: number;
}

interface Elements {
  [key: string]: Element;
}

interface Coord {
  x: number;
  y: number;
}

type ElementList = Array<Element["id"]>;

@Options({})
export default class DragDropElement extends Vue {
  private selectedMode = "vue";

  private blocks: Blocks = {
    "1": {
      id: "1",
      elements: ["1", "2"]
    }
  };
  private blockList: BlockList = ["1"];
  private elements: Elements = {
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
  private elementList: ElementList = [];
  private blockCount = 1;
  private elementCount = 1;
  private chosenElement: Element | undefined = undefined;
  private mouseDownCoord: Coord | undefined = undefined;

  private performanceFlag = 0;
  private debugTime: number[] = [];

  private initialCoord: { x?: number; y?: number } = {};

  private getId(): string {
    return Math.round(Math.random() * 1000000000).toString();
  }

  private elementStyle(element: Element) {
    return {
      left: element.x + "px",
      top: element.y + "px"
    };
  }

  private mouseDownElement(e: MouseEvent) {
    const target = e.target as HTMLDivElement;
    const elementId = target && target.id.replace("element-", "");
    this.mouseDownCoord = {
      x: e.pageX,
      y: e.pageY
    };
    this.chosenElement = Object.assign({}, this.elements[elementId]);
    document.addEventListener("mousemove", this.mouseMoveElement);
    document.addEventListener("mouseup", this.mouseUpElement);
  }

  private mouseMoveElement(e: MouseEvent) {
    if (this.mouseDownCoord && this.chosenElement) {
      const moveCoordinate = {
        x: e.pageX - this.mouseDownCoord.x,
        y: e.pageY - this.mouseDownCoord.y
      };
      const id = this.chosenElement.id;
      if (id) {
        this.elements[id].x = this.chosenElement.x + moveCoordinate.x;
        this.elements[id].y = this.chosenElement.y + moveCoordinate.y;
      }
    }
  }

  private mouseUpElement(e: MouseEvent) {
    this.mouseDownCoord = undefined;
    this.chosenElement = undefined;
    document.removeEventListener("mousemove", this.mouseMoveElement);
    document.removeEventListener("mouseup", this.mouseUpElement);
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

  .element {
    position: absolute;
    border: 1px solid grey;

    img {
      width: 150px;
      pointer-events: none;
    }
  }
}
</style>
