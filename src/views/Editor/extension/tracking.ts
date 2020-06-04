import { EventName, SourceName, Action, ActionName } from "..";

export function trackingExtension() {
  const init = (vm: any) => {
    vm.emitter.on("*", (params: any) => {
      console.log("tracking", params);
    });
  };

  return {
    init
  };
}
