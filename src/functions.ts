import { JsonRpcProvider } from "ethers";
import { assertValueIsArray, type EqFunction } from "./evaluator";
import { ValueType, type BlockType } from "./values";
import { blockFunctions } from "./block";

// TODO: Can we somehow figure out how to pass this into the function dynamically?
export const provider = new JsonRpcProvider(
  "https://mainnet.infura.io/v3/b22c7c86a99d48f78f0e1ef1d32da706",
);

const funcLength: EqFunction = {
  name: "length",
  arg: {
    name: "array",
    type: ValueType.Array,
  },
  execute: async (array) => {
    assertValueIsArray(array);

    return {
      type: ValueType.Number,
      value: array.value.length,
    };
  },
};

export const builtinFunctions: EqFunction[] = [...blockFunctions, funcLength];
