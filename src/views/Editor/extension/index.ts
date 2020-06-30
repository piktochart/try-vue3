import { Initializer, CoreActionName, CoreSourceName, CoreEventName } from "..";
import { history, HistoryActionName, HistorySourceName } from "./history";
import { tracking } from "./tracking";
import { session, SessionSourceName } from "./session";
import { canvas } from "./canvas";
import { toolbar } from "./toolbar";

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

export function useExtension(vm: Initializer) {
  const refHistory = history(vm);
  canvas(vm);
  tracking(vm);
  session(vm);
  const refToolbar = toolbar(vm);

  return {
    refHistory,
    refToolbar
  };
}
