import { Buffer } from "node:buffer"
import { and, asc, desc, eq, gt, lt, or, type AnyColumn, type SQL } from "drizzle-orm"

import { ValidationError } from "@/http/errors/errors"

import type { CursorPagination, ICursorPaginated } from "./response"

export type CursorValue = {
    id: string
}

export type SortDirection = "asc" | "desc"

export type CursorSortColumn = {
    column: AnyColumn
    direction: SortDirection
    parseValue?: (value: string | number) => unknown
}

type CursorDirection = "next" | "previous"

type DecodedCursor = {
    id: string
    direction: CursorDirection
    sortValue?: string | number
}

export type CursorQueryParams = {
    cursor?: string
}

export type CursorColumns = {
    id: AnyColumn
}

export function encodeCursor(value: CursorValue & { sortValue?: string | number }, direction: CursorDirection): string {
    const payload: Record<string, unknown> = { id: value.id, direction }
    if (value.sortValue !== undefined) payload.sortValue = value.sortValue
    return Buffer.from(JSON.stringify(payload)).toString("base64url")
}

export function decodeCursor(cursor: string): DecodedCursor {
    try {
        const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
            id?: unknown
            direction?: unknown
            sortValue?: unknown
        }
        const sortValueValid =
            value.sortValue === undefined || typeof value.sortValue === "string" || typeof value.sortValue === "number"

        if (
            typeof value.id !== "string" ||
            value.id.length === 0 ||
            (value.direction !== "next" && value.direction !== "previous") ||
            !sortValueValid
        ) {
            throw new ValidationError("Invalid cursor")
        }

        return { id: value.id, direction: value.direction, sortValue: value.sortValue as string | number | undefined }
    } catch (error) {
        if (error instanceof ValidationError) throw error
        throw new ValidationError("Invalid cursor")
    }
}

export function isValidCursor(cursor: string): boolean {
    try {
        decodeCursor(cursor)
        return true
    } catch {
        return false
    }
}

export function cursorWhere(
    columns: CursorColumns,
    { cursor }: CursorQueryParams,
    sort?: CursorSortColumn,
): SQL | undefined {
    if (!cursor) return undefined
    const decoded = decodeCursor(cursor)

    if (!sort) return decoded.direction === "next" ? lt(columns.id, decoded.id) : gt(columns.id, decoded.id)
    if (decoded.sortValue === undefined) throw new ValidationError("Invalid cursor")

    const walkAsc = decoded.direction === "next" ? sort.direction === "asc" : sort.direction === "desc"
    const cmp = walkAsc ? gt : lt
    const sortValue = sort.parseValue ? sort.parseValue(decoded.sortValue) : decoded.sortValue

    return or(cmp(sort.column, sortValue), and(eq(sort.column, sortValue), cmp(columns.id, decoded.id)))
}

export function cursorOrder(columns: CursorColumns, { cursor }: CursorQueryParams, sort?: CursorSortColumn) {
    const isPrevious = cursor ? decodeCursor(cursor).direction === "previous" : false

    if (!sort) return isPrevious ? [asc(columns.id)] : [desc(columns.id)]

    const walkAsc = isPrevious ? sort.direction !== "asc" : sort.direction === "asc"
    const orderFn = walkAsc ? asc : desc

    return [orderFn(sort.column), orderFn(columns.id)]
}

export function buildCursorPage<T extends CursorValue>(
    rows: T[],
    limit: number,
    { cursor }: CursorQueryParams,
    total?: number,
    sort?: { getValue: (row: T) => string | number },
): ICursorPaginated<T> {
    const direction = cursor ? decodeCursor(cursor).direction : undefined
    const isPrevious = direction === "previous"
    const hasExtraItem = rows.length > limit
    const pageRows = rows.slice(0, limit)
    const data = isPrevious ? pageRows.reverse() : pageRows
    const hasPreviousPage = isPrevious ? hasExtraItem : Boolean(cursor)
    const hasNextPage = isPrevious ? Boolean(cursor) : hasExtraItem
    const makeCursor = (row: T, dir: CursorDirection) =>
        encodeCursor({ id: row.id, sortValue: sort?.getValue(row) }, dir)

    const pagination: CursorPagination = {
        limit,
        next: hasNextPage && data.length > 0 ? makeCursor(data[data.length - 1], "next") : null,
        prev: hasPreviousPage && data.length > 0 ? makeCursor(data[0], "previous") : null,
        ...(total !== undefined ? { total } : {}),
    }

    return { data, pagination }
}
