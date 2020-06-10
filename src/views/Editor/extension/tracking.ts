export function tracking() {
  const init = (vm: any) => {
    vm.emitter.on("*", (name: string, params: any) => {
      console.log("tracking", name, params);
    });
  };

  return {
    init
  };
}
