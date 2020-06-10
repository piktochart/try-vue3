import { history } from "./history";
import { tracking } from "./tracking";

export { HistoryActionName } from "./history";

export function declareMethods() {
  const { init: historyInit, ...historyActions } = history();
  const { init: trackingInit } = tracking();

  const initExtension = (vm: any) => {
    historyInit(vm);
    trackingInit(vm);
  };

  return {
    initExtension,
    ...historyActions
  };
}
