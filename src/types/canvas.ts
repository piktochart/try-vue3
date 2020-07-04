import { ItemContainer } from "@/module/canvas-item/container/types";
import { Image } from "@/module/canvas-item/image/types";
import { Text } from "@/module/canvas-item/text/types";
import { ItemTypes } from "@/module/canvas-item";

export interface Block {
  id: string;
  items: Array<Item["id"]>;
}

export interface Blocks {
  [key: string]: Block;
}

export type BlockList = Array<Block["id"]>;

interface ItemBase {
  id: string;
  container: ItemContainer;
}

export interface ItemImage extends ItemBase {
  type: ItemTypes.IMAGE;
  content: Image;
}

export interface ItemText extends ItemBase {
  type: ItemTypes.TEXT;
  content: Text;
}

export type Item = ItemImage | ItemText;

export type Items = Record<Item["id"], Item>;

export type ItemList = Array<Item["id"]>;

export type Selected = Record<Item["id"], 1>;
