import { ValueType, type Value } from "./values";

export type EqFunction = {
  name: string;
} & (
  | {
      arg: {
        name: string;
        type: ValueType;
      };

      execute: (arg: Value) => Promise<Value>;
    }
  | {
      arg?: undefined;
      execute: () => Promise<Value>;
    }
);

export type Command =
  | {
      function: string;
    }
  | {
      value: Value;
    };
export type Commands = Command[];

export type State = {
  functions: EqFunction[];
  code: Commands;
  currentValue: Value;
};

export const execute = async (state: State): Promise<State> => {
  let newState = state;

  while (newState.code.length > 0) {
    newState = await executeNextCommand(newState);
  }

  return newState;
};

export const executeNextCommand = async (state: State): Promise<State> => {
  const command = state.code[0];
  if (!command) {
    return state;
  }

  if ("value" in command) {
    return {
      ...state,
      code: state.code.slice(1),
      currentValue: command.value,
    };
  }

  const func = state.functions.find((f) => f.name === command.function);

  if (!func) {
    throw new Error(`Function ${command.function} not found`);
  }

  const newVal = await executeFunction(func, state.currentValue);

  return {
    ...state,
    code: state.code.slice(1),
    currentValue: newVal,
  };
};

const executeFunction = async (
  func: EqFunction,
  arg: Value,
): Promise<Value> => {
  if (func.arg) {
    assertValueType(arg, func.arg.type);

    return func.execute(arg);
  } else {
    return func.execute();
  }
};

export const assertValueType = (value: Value, type: ValueType): void => {
  if (value.type !== type) {
    throw new Error(`Expected value of type ${type}, got ${value.type}`);
  }
};

export const assertValueIsArray = (value: Value): void => {
  assertValueType(value, ValueType.Array);

  if (!Array.isArray(value.value)) {
    throw new Error("Expected value to be an array");
  }
};

export const assertArrayType = (value: Value, elementType: ValueType): void => {
  assertValueIsArray(value);

  if (value.value.some((v) => typeof v !== "object")) {
    throw new Error("Expected all values in array to be objects");
  }

  if (value.value.some((v) => v.type !== elementType)) {
    throw new Error(
      `Expected all values in array to be of type ${elementType}`,
    );
  }
};
