import { Block } from "ethers";
import { ValueType, type BlockType } from "./values";
import { assertValueType, type EqFunction } from "./evaluator";
import { provider } from "./functions";

export const rawBlockToVal = (block: Block): BlockType => ({
  hash: block.hash!,
  transactions: block.transactions! as string[],
});

const funcBlock: EqFunction = {
  name: "block",
  execute: async () => {
    const block = await provider.getBlock("latest");

    return {
      type: ValueType.Block,
      value: rawBlockToVal(block as Block),
    };
  },
};

const funcHash: EqFunction = {
  name: "hash",
  arg: {
    name: "block",
    type: ValueType.Block,
  },
  execute: async (block) => {
    assertValueType(block, ValueType.Block);

    return {
      type: ValueType.String,
      value: block.value.hash,
    };
  },
};

const funcTransactions: EqFunction = {
  name: "transactions",
  arg: {
    name: "block",
    type: ValueType.Block,
  },
  execute: async (block) => {
    assertValueType(block, ValueType.Block);

    return {
      type: ValueType.Array,
      value: block.value.transactions.map((tx) => ({
        type: ValueType.String,
        value: tx,
      })),
    };
  },
};

export const blockFunctions = [funcBlock, funcHash, funcTransactions];
