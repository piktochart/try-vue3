import {
  EventName,
  SourceName,
  ActionParams,
  ActionName,
  ActionFunction
} from "..";
import { History } from "@/module/history";

export const enum HistoryActionName {
  UNDO_HISTORY = "undo-history",
  REDO_HISTORY = "redo-history"
}

export const enum HistorySourceName {
  USER_HISTORY_UNDO = "user-history-undo",
  USER_HISTORY_REDO = "user-history-redo"
}

export function history() {
  const historyStore = History<ActionParams>();

  const init = (vm: any) => {
    vm.emitter.on(EventName.ITEM_CREATED, (params: any) => {
      if (params.source === SourceName.USER_CLICK_CREATE) {
        // generate history for undo/redo creation
        const item = params.newItem;
        const history = historyStore.generateHistoryObject();
        history.name = params.source;
        const undoAction: ActionParams = {
          name: ActionName.DELETE_ITEM,
          value: {
            itemId: item.id,
            source: HistorySourceName.USER_HISTORY_UNDO
          },
          toConfirm: true
        };
        history.undo.push(undoAction);
        const redoAction: ActionParams = {
          name: ActionName.CREATE_ITEM,
          value: {
            item,
            source: HistorySourceName.USER_HISTORY_REDO
          },
          toConfirm: true
        };
        history.redo.push(redoAction);
        historyStore.saveHistory(history);
      }
    });

    vm.emitter.on(EventName.ITEM_UPDATED, (params: any) => {
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
            source: HistorySourceName.USER_HISTORY_UNDO
          },
          toConfirm: true
        };
        history.undo.push(undoAction);
        const redoAction: ActionParams = {
          name: ActionName.UPDATE_ITEM,
          value: {
            originalItem,
            itemToUpdate: updatedItem,
            source: HistorySourceName.USER_HISTORY_REDO
          },
          toConfirm: true
        };
        history.redo.push(redoAction);
        historyStore.saveHistory(history);
      }
    });
  };

  const undo: ActionFunction = (params, runAction) => {
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
  };

  const redo: ActionFunction = (params, runAction) => {
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
  };

  return {
    init,
    [HistoryActionName.UNDO_HISTORY]: undo,
    [HistoryActionName.REDO_HISTORY]: redo
  };
}
