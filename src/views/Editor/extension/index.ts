import { Initializer } from "..";
import { history } from "./history";
import { tracking } from "./tracking";
import { session } from "./session";

export { HistoryActionName, HistorySourceName } from "./history";
export { SessionSourceName } from "./session";

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
