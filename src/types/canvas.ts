export interface Block {
  id: string;
  items: Array<Item["id"]>;
}

export interface Blocks {
  [key: string]: Block;
}

export type BlockList = Array<Block["id"]>;

export interface Item {
  id: string;
  x: number;
  y: number;
}

export interface Items {
  [key: string]: Item;
}

export interface Coord {
  x: number;
  y: number;
}

export type ItemList = Array<Item["id"]>;
