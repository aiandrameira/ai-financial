type MetaType = "success" | "error";

export interface Meta {
    message: string;
    status: number;
    type: MetaType;
}

export interface GetResponse<T> {
    data: T;
    mata: Meta;
}

export interface FindResponse<T> {
    data: T[];
    mata: Meta;
}

export interface IPaginated<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
}

export interface PaginatedResponse<T> extends IPaginated<T> {
    mata: Meta;
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

export type ApiResponse<T> = GetResponse<T> | FindResponse<T> | PaginatedResponse<T> | CursorPaginatedResponse<T>;
