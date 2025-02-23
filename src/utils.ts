type Callbacks<TState> = (
  get: {
    (): TState;
    <TKey extends keyof TState>(key?: TKey): TState[TKey];
  },
  set: <TKey extends keyof TState>(field: TKey, value: TState[TKey]) => void,
  extend: { describe: Describe<TState> },
) => void;

type Describe<TState> = (label: string, callback: Callbacks<TState>) => void;

const createDescribe = <TState>(): Describe<TState> => {
  const describe: Describe<TState> = (label, callback) => {
    console.log(`Executing: ${label}`);

    const extend = { describe }; // Recursively pass the same function

    callback(
      ((key?: keyof TState) =>
        key !== undefined ? ({} as TState[typeof key]) : ({} as TState)) as any,
      ((field: keyof TState, value: TState[keyof TState]) => {
        console.log(`Setting ${String(field)} =`, value);
      }) as any,
      extend,
    );
  };

  return describe;
};

type MyState = {
  userId: number;
  userName: string;
};

const describe = createDescribe<MyState>();
describe('test', (get, set, extend) => {
  const userId = get('userId');
  const state = get();
  set('userId', 1);

  extend.describe('nested test', (get, set, extend) => {
    const userId = get('userId');
    const state = get();
    set('userName', '1');
  });
});
