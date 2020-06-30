export function isObjectEmpty(obj: Record<string, any>) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
  }
  return true;
}

export function getId(): string {
  return Math.round(Math.random() * 1000000000).toString();
}
