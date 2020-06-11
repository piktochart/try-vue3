import { history } from "./history";
import { tracking } from "./tracking";
import { session } from "./session";

export { HistoryActionName, HistorySourceName } from "./history";

export function declareMethods() {
  const { init: historyInit, ...historyActions } = history();
  const { init: trackingInit } = tracking();
  const { init: sessionInit } = session();

  const initExtension = (vm: any) => {
    historyInit(vm);
    trackingInit(vm);
    sessionInit(vm);
  };

  return {
    initExtension,
    ...historyActions
  };
}
