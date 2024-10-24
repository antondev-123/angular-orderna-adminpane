export interface TableTotal<T> {
  field: keyof T;
  value: string | number;
  isLabel: boolean;
}
