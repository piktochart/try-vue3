import { Initializer, ActionValue } from "../..";
import { ActionName, EventName } from "../";
import { useStore } from "vuex";
import { Item } from "@/types/canvas";
import { DeepPartial } from "utility-types";

export function canvas({ registerAction, emitter }: Initializer) {
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
    async (params: ActionValue<{ itemTempToUpdate: DeepPartial<Item> }>) => {
      const itemTempToUpdate = params.itemTempToUpdate;
      const updatedItem = await store.dispatch("canvas/updateItemTemp", {
        itemTempToUpdate
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
    async (params: ActionValue<{ itemToUpdate: DeepPartial<Item> }>) => {
      const itemToUpdate = params.itemToUpdate;
      const updatedItem = await store.dispatch("canvas/updateItem", {
        itemToUpdate
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
