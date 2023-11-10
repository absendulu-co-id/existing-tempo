export interface RootObjectMessage {
  message: string;
}

export interface RootObjectRows<T> extends Partial<RootObjectMessage> {
  count: number;
  rows: T[];
}

export interface RootObjectData<T> extends Partial<RootObjectMessage> {
  data: T[];
  total: number;
}

export interface RootObjectPagination<T> extends RootObjectData<T> {
  current_page: number;
  last_page: number;
  per_page: number;
  from: number;
  to: number;
}
