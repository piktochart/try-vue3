export interface HistoryAction {
  name: string;
  value: any;
}

export interface HistoryObject {
  name: string;
  undo: HistoryAction[];
  redo: HistoryAction[];
}

export function History() {
  const histories: HistoryObject[] = [];
  let currIndex = -1;

  const generateHistoryObject = () => {
    const historyObject: HistoryObject = {
      name: "",
      undo: [],
      redo: []
    };
    return historyObject;
  };

  const saveHistory = (historyObject: HistoryObject) => {
    histories.splice(currIndex + 1);
    histories.push(historyObject);
    currIndex = histories.length - 1;

    console.log("history state", histories, currIndex);
  };

  const undoHistory = () => {
    if (currIndex >= 0) {
      return histories[currIndex--];
    } else {
      return undefined;
    }
  };

  const redoHistory = () => {
    if (currIndex < histories.length - 1) {
      return histories[++currIndex];
    } else {
      return undefined;
    }
  };

  return {
    generateHistoryObject,
    saveHistory,
    undoHistory,
    redoHistory
  };
}
