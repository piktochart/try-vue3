import { EventName, SourceName, Action, ActionName } from "..";
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
  const historyStore = History<Action>();

  const init = (vm: any) => {
    vm.emitter.on(EventName.ITEM_CREATED, (params: any) => {
      if (params.source === SourceName.USER_CLICK_CREATE) {
        // generate history for undo/redo creation
        const item = params.newItem;
        const history = historyStore.generateHistoryObject();
        history.name = params.source;
        const undoAction: Action = {
          name: ActionName.DELETE_ITEM,
          value: {
            itemId: item.id,
            confirm: vm.confirm,
            source: HistorySourceName.USER_HISTORY_UNDO
          }
        };
        history.undo.push(undoAction);
        const redoAction: Action = {
          name: ActionName.CREATE_ITEM,
          value: {
            item,
            confirm: vm.confirm,
            source: HistorySourceName.USER_HISTORY_REDO
          }
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
        const undoAction: Action = {
          name: ActionName.UPDATE_ITEM,
          value: {
            originalItem: updatedItem,
            itemToUpdate: originalItem,
            confirm: vm.confirm,
            source: HistorySourceName.USER_HISTORY_UNDO
          }
        };
        history.undo.push(undoAction);
        const redoAction: Action = {
          name: ActionName.UPDATE_ITEM,
          value: {
            originalItem,
            itemToUpdate: updatedItem,
            confirm: vm.confirm,
            source: HistorySourceName.USER_HISTORY_REDO
          }
        };
        history.redo.push(redoAction);
        historyStore.saveHistory(history);
      }
    });
  };

  const undo = (params: any, runAction: any) => {
    const historyObject = historyStore.undoHistory();
    if (!historyObject) {
      return null;
    }
    const undoAction = historyObject.undo;
    if (!undoAction) {
      return Promise.resolve();
    }

    const undoPromises: Promise<any>[] = [];
    undoAction.forEach(action => {
      undoPromises.push(runAction(action));
    });
    return Promise.all(undoPromises);
  };
  const redo = (params: any, runAction: any) => {
    const historyObject = historyStore.redoHistory();
    if (!historyObject) {
      return null;
    }
    const redoAction = historyObject.redo;
    if (!redoAction) {
      return Promise.resolve();
    }

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
