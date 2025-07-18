export type UUID = string;

export interface BaseEntity {
  id: UUID;
}

export interface ListResponse<T> {
  entities: T[];
}
