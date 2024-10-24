export interface FilterOptionItem<U> {
  value: U;
  label: string;
}

export interface FilterOptionGroup<T, K extends keyof T> {
  groupName: K;
  options: FilterOptionItem<T[K]>[];
}

export type FilterOption<T, K extends keyof T> =
  | FilterOptionItem<T[K]>
  | FilterOptionGroup<T, K>;
