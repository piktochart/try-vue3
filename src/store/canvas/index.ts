import { Module } from "vuex";
import merge from "deepmerge";
import { Blocks, BlockList, Item, Items, ItemList } from "@/types/canvas";
import { DeepPartial } from "utility-types";

export interface State {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
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
  itemList: [],
  selectedIds: { "844679058": 1 }
});

export const canvasModule: Module<State, any> = {
  namespaced: true,
  state: getInitialState(),
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
    updateItemTemp(state, itemParams: DeepPartial<Item>) {
      const itemId = itemParams.id;
      if (itemId) {
        state.items[itemId].temp = state.items[itemId].temp || {};
        state.items[itemId].temp = merge(state.items[itemId].temp, itemParams);
      }
    },
    updateItem(state, itemParams: DeepPartial<Item>) {
      const itemId = itemParams.id;
      if (itemId) {
        state.items[itemId] = merge(state.items[itemId], itemParams);
        delete state.items[itemId].temp;
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
      if (state.items[payload.itemTempToUpdate.id]) {
        commit("updateItemTemp", payload.itemTempToUpdate);
        return state.items[payload.itemTempToUpdate.id];
      } else {
        throw new Error("No updated item to be found!");
      }
    },
    updateItem({ state, commit }, payload) {
      if (state.items[payload.itemToUpdate.id]) {
        commit("updateItem", payload.itemToUpdate);
        return state.items[payload.itemToUpdate.id];
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
