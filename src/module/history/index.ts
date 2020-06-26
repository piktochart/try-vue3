export interface HistoryObject<P> {
  name: string;
  undo: P[];
  redo: P[];
}

export type HistoryChangedCallback = (
  index: number,
  historyLength: number
) => void;

export function History<P>() {
  const histories: HistoryObject<P>[] = [];
  let currIndex = -1;
  const callbacks: HistoryChangedCallback[] = [];

  const generateHistoryObject = () => {
    const historyObject: HistoryObject<P> = {
      name: "",
      undo: [],
      redo: []
    };
    return historyObject;
  };

  const historyChanged = () => {
    callbacks.forEach(callback => {
      callback(currIndex, histories.length);
    });
  };

  const saveHistory = (historyObject: HistoryObject<P>) => {
    histories.splice(currIndex + 1);
    histories.push(historyObject);
    currIndex = histories.length - 1;
    historyChanged();
  };

  const undoHistory = () => {
    if (currIndex >= 0) {
      currIndex--;
      historyChanged();
      return histories[currIndex + 1];
    } else {
      return undefined;
    }
  };

  const redoHistory = () => {
    if (currIndex < histories.length - 1) {
      ++currIndex;
      historyChanged();
      return histories[currIndex];
    } else {
      return undefined;
    }
  };

  const onHistoryChange = (
    callback: (index: number, historyLength: number) => void
  ) => {
    callbacks.push(callback);
  };

  return {
    generateHistoryObject,
    saveHistory,
    undoHistory,
    redoHistory,
    onHistoryChange
  };
}
