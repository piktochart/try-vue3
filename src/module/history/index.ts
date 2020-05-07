export interface HistoryObject<P> {
  name: string;
  undo: P[];
  redo: P[];
}

export function History<P>() {
  const histories: HistoryObject<P>[] = [];
  let currIndex = -1;

  const generateHistoryObject = () => {
    const historyObject: HistoryObject<P> = {
      name: "",
      undo: [],
      redo: []
    };
    return historyObject;
  };

  const saveHistory = (historyObject: HistoryObject<P>) => {
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
