import { Initializer } from "..";

export function tracking({ emitter }: Initializer) {
  emitter.on("*", (name, params) => {
    console.log("tracking", name, params);
  });
}
