import { Buffer } from "node:buffer"
import { type AnyColumn, asc, desc, gt, lt, type SQL } from "drizzle-orm"

import { ValidationError } from "@/http/errors/errors"

import type { CursorPagination, ICursorPaginated } from "./response"

export type CursorValue = { id: string }
type CursorDirection = "next" | "previous"
export type CursorQueryParams = { cursor?: string }
export type CursorColumns = { createdAt: AnyColumn; id: AnyColumn }

export function encodeCursor(value: CursorValue, direction: CursorDirection): string {
    return Buffer.from(JSON.stringify({ id: value.id, direction })).toString("base64url")
}

export function decodeCursor(cursor: string): CursorValue & { direction: CursorDirection } {
    try {
        const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
            id?: unknown
            direction?: unknown
        }

        if (
            typeof value.id !== "string" ||
            value.id.length === 0 ||
            (value.direction !== "next" && value.direction !== "previous")
        ) {
            throw new ValidationError("Invalid cursor")
        }

        return { id: value.id, direction: value.direction }
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

export function cursorWhere(columns: CursorColumns, { cursor }: CursorQueryParams): SQL | undefined {
    if (!cursor) return undefined
    const { id, direction } = decodeCursor(cursor)
    return direction === "next" ? lt(columns.id, id) : gt(columns.id, id)
}

export function cursorOrder(columns: CursorColumns, { cursor }: CursorQueryParams) {
    const isPrevious = cursor ? decodeCursor(cursor).direction === "previous" : false
    return isPrevious ? [asc(columns.id)] : [desc(columns.id)]
}

export function buildCursorPage<T extends CursorValue>(
    rows: T[],
    limit: number,
    { cursor }: CursorQueryParams,
    total?: number,
): ICursorPaginated<T> {
    const direction = cursor ? decodeCursor(cursor).direction : undefined
    const isPrevious = direction === "previous"
    const hasExtraItem = rows.length > limit
    const pageRows = rows.slice(0, limit)
    const data = isPrevious ? pageRows.reverse() : pageRows
    const hasPreviousPage = isPrevious ? hasExtraItem : Boolean(cursor)
    const hasNextPage = isPrevious ? Boolean(cursor) : hasExtraItem
    const pagination: CursorPagination = {
        limit,
        next: hasNextPage && data.length > 0 ? encodeCursor(data[data.length - 1], "next") : null,
        prev: hasPreviousPage && data.length > 0 ? encodeCursor(data[0], "previous") : null,
        ...(total !== undefined ? { total } : {}),
    }

    return { data, pagination }
}
