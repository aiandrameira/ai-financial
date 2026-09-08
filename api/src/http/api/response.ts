type ResponseType = "success" | "error"

type Meta = {
    message: string
    status: number
    type: ResponseType
}

export type CursorPagination = {
    limit: number
    next: string | null
    prev: string | null
    total?: number
}

export type ICursorPaginated<T> = {
    data: T[]
    pagination: CursorPagination
}

export type CursorPaginatedResponse<T> = ICursorPaginated<T> & {
    meta: Meta
}

export type ListResponse<T> = {
    data: T[]
    total: number
    meta: Meta
}

export type ItemResponse<T> = {
    data: T
    meta: Meta
}

export type SuccessResponse = {
    data: null
    meta: Meta
}

export type ErrorResponse = {
    data: null
    meta: Meta
}

export const ApiResponse = {
    cursorPaginated<T>(result: ICursorPaginated<T>, message = "OK", status = 200): CursorPaginatedResponse<T> {
        return {
            data: result.data,
            pagination: result.pagination,
            meta: { message, status, type: "success" },
        }
    },

    list<T>(data: T[], message = "OK", status = 200): ListResponse<T> {
        return {
            data,
            total: data.length,
            meta: { message, status, type: "success" },
        }
    },

    item<T>(data: T, message = "OK", status = 200): ItemResponse<T> {
        return {
            data,
            meta: { message, status, type: "success" },
        }
    },

    success(message = "OK", status = 200): SuccessResponse {
        return {
            data: null,
            meta: { message, status, type: "success" },
        }
    },

    error(message: string, status: number): ErrorResponse {
        return {
            data: null,
            meta: { message, status, type: "error" },
        }
    },
}
