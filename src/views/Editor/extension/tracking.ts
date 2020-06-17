import { Initializer } from "..";

export function tracking() {
  const init = ({ emitter }: Initializer) => {
    emitter.on("*", (name, params) => {
      console.log("tracking", name, params);
    });
  };

  return {
    init
  };
}
