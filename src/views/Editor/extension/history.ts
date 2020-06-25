import { reactive, toRefs } from "vue";
import { Initializer, ActionParams } from "..";
import { ActionName, EventName, SourceName } from ".";
import { History } from "@/module/history";

export enum HistoryActionName {
  UNDO_HISTORY = "undo-history",
  REDO_HISTORY = "redo-history"
}

export enum HistorySourceName {
  USER_HISTORY_UNDO = "user-history-undo",
  USER_HISTORY_REDO = "user-history-redo"
}

export function history({ emitter, runAction, registerAction }: Initializer) {
  const historyStore = History<ActionParams>();
  const refHistory = reactive({
    canUndo: false,
    canRedo: false
  });

  emitter.on(EventName.ITEM_CREATED, (params: any) => {
    if (params.source === SourceName.USER_CLICK_CREATE) {
      // generate history for undo/redo creation
      const item = params.newItem;
      const history = historyStore.generateHistoryObject();
      history.name = params.source;
      const undoAction: ActionParams = {
        name: ActionName.DELETE_ITEM,
        value: {
          itemId: item.id,
          source: SourceName.USER_HISTORY_UNDO
        },
        toConfirm: true
      };
      history.undo.push(undoAction);
      const redoAction: ActionParams = {
        name: ActionName.CREATE_ITEM,
        value: {
          item,
          source: SourceName.USER_HISTORY_REDO
        },
        toConfirm: true
      };
      history.redo.push(redoAction);
      historyStore.saveHistory(history);
    }
  });

  emitter.on(EventName.ITEM_UPDATED, (params: any) => {
    if (params.source === SourceName.USER_MOVED_ITEM) {
      // generate history for undo/redo creation
      const originalItem = Object.assign({}, params.originalItem);
      const updatedItem = Object.assign({}, params.updatedItem);
      const history = historyStore.generateHistoryObject();
      history.name = params.source;
      const undoAction: ActionParams = {
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem: updatedItem,
          itemToUpdate: originalItem,
          source: SourceName.USER_HISTORY_UNDO
        },
        toConfirm: true
      };
      history.undo.push(undoAction);
      const redoAction: ActionParams = {
        name: ActionName.UPDATE_ITEM,
        value: {
          originalItem,
          itemToUpdate: updatedItem,
          source: SourceName.USER_HISTORY_REDO
        },
        toConfirm: true
      };
      history.redo.push(redoAction);
      historyStore.saveHistory(history);
    }
  });

  registerAction(ActionName.UNDO_HISTORY, () => {
    const historyObject = historyStore.undoHistory();
    if (!historyObject?.undo) {
      return Promise.resolve();
    }
    const undoAction = historyObject.undo;
    const undoPromises: Promise<any>[] = [];
    undoAction.forEach(action => {
      undoPromises.push(runAction(action));
    });
    return Promise.all(undoPromises);
  });

  registerAction(ActionName.REDO_HISTORY, () => {
    const historyObject = historyStore.redoHistory();
    if (!historyObject?.redo) {
      return Promise.resolve();
    }
    const redoAction = historyObject.redo;
    const redoPromises: Promise<any>[] = [];
    redoAction.forEach(action => {
      redoPromises.push(runAction(action));
    });
    return Promise.all(redoPromises);
  });

  historyStore.onHistoryChange((idx, len) => {
    const historyAvailable = len > 0;
    refHistory.canUndo = historyAvailable && idx >= 0;
    refHistory.canRedo = historyAvailable && idx < len - 1;
  });

  return {
    ...toRefs(refHistory)
  };
}
