import { SortDirection } from '@angular/material/sort';

export interface CellModel {
  component: string;
  data: string | 'all';
}
export enum TableSearchType {
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select',
  TEXT = 'text',
  DATE_RANGE = 'dateRange',
}

export interface TableConfModel {
  defaultSort?: { column: string; direction: SortDirection };
  columns: {
    name: string;
    sort?: boolean | string;
    search?: { value: string; type: TableSearchType; values?: string[] };
    header: CellModel;
    content: CellModel;
  }[];
  defaultPageSize?: number;
}

export interface TableResult<T> {
  data: T[];
  count: number;
}
