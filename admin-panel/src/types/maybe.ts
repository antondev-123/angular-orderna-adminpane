export type Maybe<T> = T | null | undefined;

export type Maybeify<T> = {
  [P in keyof T]: Maybe<T[P]>;
};
