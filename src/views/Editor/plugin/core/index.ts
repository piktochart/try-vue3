import { Initializer, ActionValue } from "../..";
import { ActionName, EventName } from "../";
import { useStore } from "vuex";
import { Item } from "@/types/canvas";
import { DeepPartial } from "utility-types";

export enum CoreSourceName {
  USER_CLICK_CREATE = "user-click-create",
  USER_MOUSEDOWN_ITEM = "user-mousedown-item",
  USER_MOVING_ITEM = "user-moving-item",
  USER_MOVED_ITEM = "user-moved-item",
  USER_CLICK_HISTORY = "user-click-history"
}

export enum CoreActionName {
  CREATE_ITEM = "create-item",
  UPDATE_ITEM = "update-item",
  UPDATE_ITEM_TEMP = "update-item-temp",
  DELETE_ITEM = "delete-item",
  CLEAR_CANVAS = "clear-canvas",
  NEW_SELECTION = "new-selection",
  ADD_SELECTION = "add-selection",
  REMOVE_SELECTION = "remove-selection",
  CLEAR_SELECTION = "clear-selection"
}

export enum CoreEventName {
  ITEM_CREATED = "item-created",
  ITEM_UPDATED = "item-updated",
  ITEM_TEMP_UPDATED = "item-temp-updated",
  ITEM_DELETED = "item-deleted",
  CANVAS_CLEARED = "canvas-cleared",
  ITEM_SELECTED = "item-selected",
  DROPPED_ON_BLOCK = "dropped-on-block"
}

export function core({ registerAction, emitter }: Initializer) {
  const store = useStore();

  // Init the core actions of the editor
  registerAction(ActionName.CLEAR_CANVAS, async params => {
    await store.dispatch("canvas/clearCanvas");
    emitter.emit(EventName.CANVAS_CLEARED, {
      ...params
    });
  });

  registerAction(
    ActionName.CREATE_ITEM,
    async (params: ActionValue<{ item: Item }>) => {
      const newItem: Item = params.item;
      await store.dispatch("canvas/createItem", { newItem });
      emitter.emit(EventName.ITEM_CREATED, {
        ...params,
        newItem
      });
      return newItem;
    }
  );

  registerAction(
    ActionName.UPDATE_ITEM_TEMP,
    async (
      params: ActionValue<{ id: Item["id"]; value: DeepPartial<Item> }>
    ) => {
      const { id, value } = params;
      const updatedItem = await store.dispatch("canvas/updateItemTemp", {
        id,
        itemTemp: {
          type: "modified",
          value
        }
      });
      emitter.emit(EventName.ITEM_TEMP_UPDATED, {
        ...params,
        updatedItem
      });
      return updatedItem;
    }
  );

  registerAction(
    ActionName.UPDATE_ITEM,
    async (
      params: ActionValue<{ id: Item["id"]; value: DeepPartial<Item> }>
    ) => {
      const { id, value } = params;
      const updatedItem = await store.dispatch("canvas/updateItem", {
        id,
        item: value
      });

      emitter.emit(EventName.ITEM_UPDATED, {
        ...params,
        updatedItem
      });
      return updatedItem;
    }
  );

  registerAction(
    ActionName.DELETE_ITEM,
    async (params: ActionValue<{ itemId: Item["id"] }>) => {
      const deletedItem = await store.dispatch("canvas/deleteItem", {
        itemId: params.itemId
      });
      emitter.emit(EventName.ITEM_DELETED, {
        ...params,
        deletedItem
      });
      return deletedItem;
    }
  );

  registerAction(
    ActionName.NEW_SELECTION,
    async (params: ActionValue<{ itemId: Item["id"] }>) => {
      const selectedIds = await store.dispatch("canvas/newSelection", {
        itemIds: [params.itemId]
      });
      emitter.emit(EventName.ITEM_SELECTED, {
        ...params,
        selectedIds
      });
      return selectedIds;
    }
  );
}
