import { Module } from "vuex";
import merge from "deepmerge";
import { Blocks, BlockList, Item, Items, ItemList } from "@/types/canvas";
import { DeepPartial } from "utility-types";
import { isObjectEmpty } from "@/helper";

interface TempItemModified {
  type: "modified";
  value?: DeepPartial<Omit<Item, "temp" | "id" | "type">>;
}

type TempItem = TempItemModified;

export interface State {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
  itemsTemp: Record<Item["id"], TempItem>;
  selectedIds: Record<Item["id"], 1>;
}

const getInitialState = (): State => ({
  blocks: {
    "1": {
      id: "1",
      items: []
    }
  },
  blockList: ["1"],
  items: {},
  itemsTemp: {},
  itemList: [],
  selectedIds: {}
});

export const canvasModule: Module<State, any> = {
  namespaced: true,
  state: getInitialState(),
  getters: {
    isSelectionEmpty(state) {
      return isObjectEmpty(state.selectedIds);
    }
  },
  mutations: {
    createItem(state, newItem: Item) {
      state.items[newItem.id] = newItem;
      state.itemList.push(newItem.id);
      state.blocks[state.blockList[0]].items.push(newItem.id);
      return newItem;
    },
    deleteItem(state, itemId: Item["id"]) {
      const item = state.items[itemId];
      state.itemList.splice(state.itemList.indexOf(itemId), 1);
      delete state.items[itemId];
      state.blocks[state.blockList[0]].items.splice(
        state.blocks[state.blockList[0]].items.indexOf(itemId),
        1
      );
      return item;
    },
    updateItemTemp(
      state,
      { id, itemTemp }: { id: Item["id"]; itemTemp: TempItem }
    ) {
      state.itemsTemp[id] = itemTemp;
    },
    updateItem(
      state,
      { id, item }: { id: Item["id"]; item: DeepPartial<Item> }
    ) {
      if (id) {
        state.items[id] = merge(state.items[id], item);
        delete state.itemsTemp[id];
      }
    },
    clearCanvas(state) {
      Object.assign(state, getInitialState());
    },
    addSelected(state, itemId) {
      state.selectedIds[itemId] = 1;
    },
    removeSelected(state, itemId) {
      delete state.selectedIds[itemId];
    },
    clearSelected(state) {
      state.selectedIds = {};
    }
  },
  actions: {
    createItem({ commit }, payload) {
      commit("createItem", payload.newItem);
      return payload.newItem;
    },
    updateItemTemp({ state, commit }, payload) {
      if (state.items[payload.id]) {
        commit("updateItemTemp", payload);
        return state.items[payload.id];
      } else {
        throw new Error("No updated item to be found!");
      }
    },
    updateItem({ state, commit }, payload) {
      if (state.items[payload.id]) {
        commit("updateItem", payload);
        return state.items[payload.id];
      } else {
        throw new Error("No updated item to be found!");
      }
    },
    deleteItem({ state, commit }, payload) {
      const deletedItem = Object.assign({}, state.items[payload.itemId]);
      commit("deleteItem", payload.itemId);
      return deletedItem;
    },
    clearCanvas({ commit }) {
      commit("clearCanvas");
    },
    newSelection({ state, commit }, payload) {
      commit("clearSelected");
      payload.itemIds.forEach((id: Item["id"]) => {
        commit("addSelected", id);
      });
      return state.selectedIds;
    },
    addSelection({ state, commit }, payload) {
      payload.itemIds.forEach((id: Item["id"]) => {
        commit("addSelected", id);
      });
      return state.selectedIds;
    },
    removeSelection({ state, commit }, payload) {
      payload.itemIds.forEach((id: Item["id"]) => {
        commit("removeSelected", id);
      });
      return state.selectedIds;
    },
    clearSelection({ commit }) {
      commit("clearSelected");
    }
  },
  modules: {}
};
