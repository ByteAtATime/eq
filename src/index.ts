import { execute, executeNextCommand, type State } from "./evaluator";
import { ValueType, type Value } from "./values";
import { builtinFunctions } from "./functions";

const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.error("No code provided");
  process.exit(1);
}

const code = inputs[0]
  .split("|")
  .map((s) => s.trim())
  .map((c) => ({ function: c }));

const initialState: State = {
  functions: builtinFunctions,
  code,
  currentValue: {
    type: ValueType.Null,
    value: null,
  },
};

const result = await execute(initialState);

console.log(result.currentValue.value);
