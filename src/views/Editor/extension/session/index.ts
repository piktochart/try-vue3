import {
  EventName,
  SourceName,
  ActionParams,
  ActionName,
  ActionFunction
} from "../..";

export function session() {
  const init = (vm: any) => {
    vm.confirm = (params: any, res: any) => {
      const latency = Math.random() * 500;
      setTimeout(res, latency);
    };
  };

  return {
    init
  };
}
