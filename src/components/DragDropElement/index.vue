<template>
  <div class="wrapper">
    <div>
      Switch Mode
      <select v-model="selectedMode">
        <option value="vue">Vue</option>
        <option value="native">Native</option>
        <option value="vue-native">Vue with Native</option>
      </select>
      <div>
        Number of Block(s) :
        <input v-model="blockCount" />
      </div>

      <div>
        Number of Element(s) in each block :
        <input v-model="elementCount" />
      </div>

      <div>Debug Average (ms) {{ debugAverage }}</div>
    </div>

    <template v-if="selectedMode === 'vue' || selectedMode === 'vue-native'">
      <div v-for="blockId in blockList" :key="blockId" class="block">
        <template v-for="elementId in blocks[blockId].elements">
          <div
            :key="elementId"
            :id="`element-${elementId}`"
            :style="elementStyle(elements[elementId])"
            class="element"
          >
            <img src="~./test.jpg" />
          </div>
        </template>
      </div>
    </template>

    <template v-if="selectedMode === 'native'">
      <div id="nativeWrapper"></div>
    </template>
  </div>
</template>
<script lang="ts">
// { left : elements[elementId].x+'px', top : elements[elementId].y+'px' }
// elementStyle(elements[elementId])
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
  id?: string;
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

@Options({
  watch: {
    blockCount: {
      immediate: true,
      handler() {
        this.initMode();
      }
    },
    elementCount: {
      immediate: true,
      handler() {
        this.initMode();
      }
    },
    selectedMode: {
      immediate: true,
      handler() {
        this.initMode();
      }
    }
  }
})
export default class DragDropElement extends Vue {
  private selectedMode = "vue";

  private blocks: Blocks = {};
  private blockList: BlockList = [];
  private elements: Elements = {};
  private elementList: ElementList = [];
  private blockCount = 1;
  private elementCount = 1;
  private chosenElement: Element | undefined = undefined;
  private mouseDownCoord: Coord | undefined = undefined;

  private performanceFlag = 0;
  private debugTime: number[] = [];

  private initialCoord: { x?: number; y?: number } = {};

  get debugAverage() {
    const sum = this.debugTime.reduce(
      (total: number, val: number) => total + val,
      0
    );
    return sum === 0 ? sum : sum / this.debugTime.length;
  }

  private async initMode() {
    switch (this.selectedMode) {
      case "vue":
        await this.$nextTick();
        this.generateElement();
        await this.$nextTick();
        this.attachVueEvent();
        break;
      case "native":
        await this.$nextTick();
        this.nativeDragDropScript();
        break;
      case "vue-native":
        await this.$nextTick();
        this.generateElement();
        await this.$nextTick();
        this.attachNativeEvent();
        break;
    }
  }

  private generateElement() {
    this.blocks = {};
    this.blockList = [];
    this.elements = {};
    this.elementList = [];
    for (let i = 0; i < this.blockCount; i++) {
      const newBlockId = this.getId();
      this.blocks[newBlockId] = {
        id: newBlockId,
        elements: []
      };
      this.blockList.push(newBlockId);
      for (let j = 0; j < this.elementCount; j++) {
        const newElementId = this.getId();
        this.elements[newElementId] = {
          id: newElementId,
          x: Math.round(Math.random() * 600),
          y: Math.round(Math.random() * 350)
        };
        this.elementList.push(newElementId);
        this.blocks[newBlockId].elements.push(newElementId);
      }
    }
  }

  private getId(): string {
    return Math.round(Math.random() * 1000000000).toString();
  }

  private elementStyle(element: Element) {
    return {
      left: element.x + "px",
      top: element.y + "px"
    };
  }

  private attachVueEvent() {
    document.querySelectorAll(".element").forEach(element => {
      element.addEventListener("mousedown", e => {
        e.preventDefault();
        this.mouseDownElement(e as MouseEvent);
      });
    });
  }

  private attachNativeEvent() {
    document.querySelectorAll(".element").forEach(element => {
      element.addEventListener("mousedown", e => {
        e.preventDefault();
        this.onMouseDown(e as MouseEvent);
      });
    });
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
    this.debugReset();
    this.debugInit();
  }

  private mouseMoveElement(e: MouseEvent) {
    this.debugFlag();
    this.debugInit();
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

  private onDoneEdit() {
    if (this.selectedMode === "vue-native") {
      const chosenElement = this.chosenElement;
      const elm = chosenElement && chosenElement.elm;
      if (chosenElement && elm) {
        const id = elm.id.replace("element-", "");
        if (id) {
          this.elements[id].x = chosenElement.x;
          this.elements[id].y = chosenElement.y;
        }
      }
    }
  }

  private mouseUpElement(e: MouseEvent) {
    this.mouseDownCoord = undefined;
    this.chosenElement = undefined;
    document.removeEventListener("mousemove", this.mouseMoveElement);
    document.removeEventListener("mouseup", this.mouseUpElement);
  }

  private debugReset() {
    this.debugTime = [];
  }

  private debugInit() {
    this.performanceFlag = Date.now();
  }

  private debugFlag() {
    this.debugTime.push(Date.now() - this.performanceFlag);
  }

  private nativeDragDropScript() {
    const wrapper = this.$el.querySelector("#nativeWrapper");
    if (!wrapper) {
      return;
    }
    // reset the wrapper before running the script
    wrapper.innerHTML = "";
    const blockCount = this.blockCount;
    const elementCount = this.elementCount;
    this.initialCoord = {};
    this.chosenElement = undefined;

    for (let i = 0; i < blockCount; i++) {
      const newBlockId = this.getId();
      const blockDiv = document.createElement("div");
      blockDiv.setAttribute("class", "block");
      blockDiv.id = "block-" + newBlockId;
      wrapper.appendChild(blockDiv);
      for (let j = 0; j < elementCount; j++) {
        const newElementId = this.getId();
        const elementDiv = document.createElement("div");
        const x = Math.round(Math.random() * 600);
        const y = Math.round(Math.random() * 350);
        elementDiv.id = "element-" + newElementId;
        elementDiv.setAttribute("class", "element");
        elementDiv.setAttribute("style", `left: ${x}px; top: ${y}px`);
        elementDiv.addEventListener("mousedown", this.onMouseDown);
        const image = document.createElement("img");
        image.src = imageUrl;
        elementDiv.appendChild(image);
        blockDiv.appendChild(elementDiv);
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (
      this.initialCoord.x &&
      this.initialCoord.y &&
      this.chosenElement &&
      this.chosenElement.elm &&
      this.chosenElement.x &&
      this.chosenElement.y
    ) {
      this.debugFlag();
      this.debugInit();
      const updateX = e.pageX - this.initialCoord.x;
      const updateY = e.pageY - this.initialCoord.y;
      this.chosenElement.elm.style.left = this.chosenElement.x + updateX + "px";
      this.chosenElement.elm.style.top = this.chosenElement.y + updateY + "px";
      console.log("mousemove", this.chosenElement.elm.style.left);
    }
  }

  private onMouseUp(e: MouseEvent) {
    console.log("mouseup", this.chosenElement.elm.style.left);
    this.onDoneEdit();
    this.initialCoord.x = undefined;
    this.initialCoord.y = undefined;
    this.chosenElement = undefined;
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  private onMouseDown(e: MouseEvent) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.style.top && target.style.left) {
      this.initialCoord.x = e.pageX;
      this.initialCoord.y = e.pageY;
      this.chosenElement = {
        x: parseInt(target.style.left, 10),
        y: parseInt(target.style.top, 10),
        elm: target as HTMLElement
      };
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    }
    this.debugReset();
    this.debugInit();
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
