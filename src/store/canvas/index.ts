import { Module } from "vuex";
import {
  Blocks,
  BlockList,
  Item,
  Items,
  Coord,
  ItemList
} from "@/types/canvas";

interface State {
  blocks: Blocks;
  blockList: BlockList;
  items: Items;
  itemList: ItemList;
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
  itemList: []
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
    updateItem(state, itemParams: Partial<Item>) {
      const itemId = itemParams.id;
      if (itemId) {
        state.items[itemId] = {
          ...state.items[itemId],
          ...itemParams
        };
      }
    },
    clearCanvas(state) {
      Object.assign(state, getInitialState());
    }
  },
  actions: {
    createItem({ commit }, payload) {
      commit("createItem", payload.newItem);
      return payload.newItem;
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
    }
  },
  modules: {}
};
