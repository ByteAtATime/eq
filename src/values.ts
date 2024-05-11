import type { Hex } from "viem";

export enum ValueType {
  Block = "block",
  String = "string",
  Number = "number",
  Null = "null",
  Array = "array",
}

export type Value = {
  type: ValueType;
  value: any;
};

export type BlockType = {
  hash: string;
  transactions: string[];
};
