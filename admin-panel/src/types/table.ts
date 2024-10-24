export type TableColumnType =
  | 'id'
  | 'checkbox'
  | 'email'
  | 'number'
  | 'string' // TODO: Be consistent and use either the term --- string OR text
  | 'text-with-subtext'
  | 'round-img-plus-string'
  | 'square-img-plus-string'
  | 'address'
  | 'link'
  | 'currency'
  | 'badge'
  | 'date';

export interface TableColumn<T extends { id: number | string }> {
  key: string;
  type: TableColumnType;
  label: string;
  getValue?: (t: T) => any;
  isCopyable?: boolean;
  truncateAfter?: number; // Number of characters to show before truncating
}

export type TableRow<T extends { id: number | string }> = T;
