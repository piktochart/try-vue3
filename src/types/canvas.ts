import { ItemContainer } from "@/module/canvas-item/container/types";
import { Image } from "@/module/canvas-item/image/types";
import { ItemTypes } from "@/module/canvas-item";

export interface Block {
  id: string;
  items: Array<Item["id"]>;
}

export interface Blocks {
  [key: string]: Block;
}

export type BlockList = Array<Block["id"]>;

export interface ItemImage {
  id: string;
  container: ItemContainer;
  type: ItemTypes.IMAGE;
  content: Image;
}

export type Item = ItemImage;

export interface Items {
  [key: string]: Item;
}

export type ItemList = Array<Item["id"]>;
