import { EventName, SourceName, Action, ActionName } from "..";

export function tracking() {
  const init = (vm: any) => {
    vm.emitter.on("*", (params: any) => {
      console.log("tracking", params);
    });
  };

  return {
    init
  };
}
