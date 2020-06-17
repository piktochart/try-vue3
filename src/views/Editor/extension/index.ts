import { Initializer, CoreActionName, CoreSourceName, CoreEventName } from "..";
import { history, HistoryActionName, HistorySourceName } from "./history";
import { tracking } from "./tracking";
import { session, SessionSourceName } from "./session";

export type ActionName = CoreActionName | HistoryActionName;
export const ActionName = {
  ...CoreActionName,
  ...HistoryActionName
};

export type SourceName = CoreSourceName | HistorySourceName | SessionSourceName;
export const SourceName = {
  ...CoreSourceName,
  ...HistorySourceName,
  ...SessionSourceName
};

export type EventName = CoreEventName;
export const EventName = {
  ...CoreEventName
};

export function declareMethods() {
  const { init: historyInit } = history();
  const { init: trackingInit } = tracking();
  const { init: sessionInit } = session();

  const initExtension = (vm: Initializer) => {
    historyInit(vm);
    trackingInit(vm);
    sessionInit(vm);
  };

  return {
    initExtension
  };
}
