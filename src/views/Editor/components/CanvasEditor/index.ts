import { defineComponent, computed, h } from "vue";
import { Item, ItemList } from "@/types/canvas";
import { itemComponents, itemComponentMapper } from "@/module/canvas-item";
import { useStore } from "vuex";
import { State as CanvasState } from "@/store/canvas";

export default defineComponent({
  name: "CanvasEditor",
  components: {
    ...(itemComponents as any)
  },
  setup(_, { emit }) {
    const store = useStore<{ canvas: CanvasState }>();
    // Store Getters
    const canvasState = {
      blocks: computed(() => store.state.canvas.blocks),
      blockList: computed(() => store.state.canvas.blockList),
      items: computed(() => store.state.canvas.items),
      itemsTemp: computed(() => store.state.canvas.itemsTemp),
      itemList: computed(() => store.state.canvas.itemList),
      selectedIds: computed(() => store.state.canvas.selectedIds),
      isSelectionEmpty: computed(() => store.getters["canvas/isSelectionEmpty"])
    };

    const onMouseDownItem = (e: MouseEvent, itemId: Item["id"]) => {
      e.preventDefault();
      const mouseDownCoord = {
        x: e.pageX,
        y: e.pageY
      };

      emit("mousedown-item", {
        itemId,
        mouseEvent: e
      });

      const mouseMoveItem = (e: MouseEvent) => {
        if (mouseDownCoord && !canvasState.isSelectionEmpty.value) {
          const moveCoordinate = {
            x: e.pageX - mouseDownCoord.x,
            y: e.pageY - mouseDownCoord.y
          };
          emit("moving-item", {
            x: moveCoordinate.x,
            y: moveCoordinate.y
          });
        }
      };

      const mouseUpItem = (e: MouseEvent) => {
        if (mouseDownCoord && !canvasState.isSelectionEmpty.value) {
          const moveCoordinate = {
            x: e.pageX - mouseDownCoord.x,
            y: e.pageY - mouseDownCoord.y
          };
          emit("moved-item", {
            x: moveCoordinate.x,
            y: moveCoordinate.y
          });
        }
        document.removeEventListener("mousemove", mouseMoveItem);
        document.removeEventListener("mouseup", mouseUpItem);
      };

      document.addEventListener("mousemove", mouseMoveItem);
      document.addEventListener("mouseup", mouseUpItem);
    };

    const onDropBlock = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emit("drop-block", e);
    };

    const onDragOverBlock = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emit("dragover-block", e);
    };

    return {
      ...canvasState,
      onMouseDownItem,
      onDropBlock,
      onDragOverBlock
    };
  },
  render() {
    const getItems = (itemList: ItemList) => {
      return itemList.map(itemId => {
        const tempItem = this.itemsTemp[itemId];
        const { container, content } =
          tempItem && tempItem.type === "modified"
            ? {
                container: {
                  ...this.items[itemId].container,
                  ...tempItem.value?.container
                },
                content: {
                  ...this.items[itemId].content,
                  ...tempItem.value?.content
                }
              }
            : {
                container: this.items[itemId].container,
                content: this.items[itemId].content
              };

        return h(
          itemComponents.CanvasItemContainer as any,
          {
            id: `item-container-${itemId}`,
            ...container,
            class: this.selectedIds[itemId] && "selected",
            onMouseDown: (e: MouseEvent) => this.onMouseDownItem(e, itemId)
          },
          {
            default: () =>
              h(itemComponentMapper(this.items[itemId].type) as any, {
                ...content
              })
          }
        );
      });
    };

    const blocks = this.blockList.map(blockId => {
      return h(
        "div",
        {
          class: "block",
          onDrop: (e: DragEvent) => this.onDropBlock(e),
          onDragOver: (e: DragEvent) => this.onDragOverBlock(e)
        },
        getItems(this.blocks[blockId].items)
      );
    });

    return blocks;
  }
});
