export interface QueryModel {
  ids?: string[];
  limit?: number;
  sort?: Record<string, number>;
  custom?: Record<string, unknown>;
  skip?: number;
}
