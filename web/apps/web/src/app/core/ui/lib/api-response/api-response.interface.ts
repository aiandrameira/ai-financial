type MetaType = "success" | "error";

export interface Meta {
    message: string;
    status: number;
    type: MetaType;
}

export interface CursorPagination {
    limit: number;
    next: string | null;
    prev: string | null;
    total?: number;
}

export interface CursorPaginated<T> {
    data: T[];
    pagination: CursorPagination;
}

export interface CursorPaginatedResponse<T> extends CursorPaginated<T> {
    meta: Meta;
}

export interface GetResponse<T> {
    data: T;
    meta: Meta;
}

export interface FindResponse<T> {
    data: T[];
    meta: Meta;
}

export type ApiResponse<T> = GetResponse<T> | FindResponse<T> | CursorPaginatedResponse<T>;
