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
    histories.push(historyObject);
    currIndex = histories.length - 1;

    console.log("history state", histories, currIndex);
  };

  return {
    generateHistoryObject,
    saveHistory
  };
}
