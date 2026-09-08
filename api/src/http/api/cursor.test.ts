import { describe, expect, test } from "bun:test"
import { PgDialect, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { ValidationError } from "@/http/errors/errors"

import { buildCursorPage, cursorOrder, cursorWhere, decodeCursor, encodeCursor } from "./cursor"
import { ApiResponse } from "./response"
import { cursorPaginationQuerySchema } from "./schema/schemas"

const table = pgTable("cursor_test", { id: text("id").notNull(), date: timestamp("date").notNull() })
const dialect = new PgDialect()
const rows = ["e", "d", "c", "b", "a"].map((id) => ({ id, date: "2026-09-01T00:00:00.000Z" }))
const sort = { getValue: (row: (typeof rows)[number]) => row.date }

describe("cursor pagination contract", () => {
    test("walks forward and back with tied sort values", () => {
        const first = buildCursorPage(rows.slice(0, 3), 2, {}, rows.length, sort)
        expect(first.data.map((row) => row.id)).toEqual(["e", "d"])
        expect(first.pagination.prev).toBeNull()
        expect(first.pagination.total).toBe(5)
        const second = buildCursorPage(rows.slice(2, 5), 2, { cursor: first.pagination.next! }, undefined, sort)
        expect(second.data.map((row) => row.id)).toEqual(["c", "b"])
        expect(second.pagination).not.toHaveProperty("total")
        const previous = buildCursorPage([rows[1], rows[0]], 2, { cursor: second.pagination.prev! }, undefined, sort)
        expect(previous.data).toEqual(first.data)
        expect(previous.pagination.prev).toBeNull()
        expect(previous.pagination.next).toBe(first.pagination.next)
        const last = buildCursorPage([rows[4]], 2, { cursor: second.pagination.next! }, undefined, sort)
        expect(last.pagination.next).toBeNull()
        expect(decodeCursor(last.pagination.prev!)).toEqual({ id: "a", direction: "previous", sortValue: rows[4].date })
    })

    test("breaks date ties by id and reverses SQL order for previous pages", () => {
        const cursor = encodeCursor({ id: "c", sortValue: rows[0].date }, "previous")
        const columnSort = {
            column: table.date,
            direction: "desc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const where = dialect.sqlToQuery(cursorWhere(table, { cursor }, columnSort)!)
        expect(where.sql).toContain('"cursor_test"."date" >')
        expect(where.sql).toContain('"cursor_test"."date" =')
        expect(where.sql).toContain('"cursor_test"."id" >')
        expect(where.params).toEqual([rows[0].date, rows[0].date, "c"])
        expect(cursorOrder(table, { cursor }, columnSort).map((order) => dialect.sqlToQuery(order).sql)).toEqual([
            '"cursor_test"."date" asc',
            '"cursor_test"."id" asc',
        ])
    })

    test("supports ascending numeric keys", () => {
        const cursor = encodeCursor({ id: "b", sortValue: 2 }, "next")
        const where = dialect.sqlToQuery(cursorWhere(table, { cursor }, { column: table.id, direction: "asc" })!)
        expect(where.sql).toContain(" > ")
        expect(where.params).toEqual([2, 2, "b"])
    })

    test("rejects malformed cursors and sorted cursors without a sort value", () => {
        for (const cursor of ["not-json", "bnVsbA", encodeCursor({ id: "" }, "next")]) {
            expect(() => decodeCursor(cursor)).toThrow(ValidationError)
            expect(cursorPaginationQuerySchema.safeParse({ cursor }).success).toBe(false)
        }
        expect(() =>
            cursorWhere(table, { cursor: encodeCursor({ id: "a" }, "next") }, { column: table.date, direction: "asc" }),
        ).toThrow(ValidationError)
    })

    test("validates query limits and returns the ai-auth response envelope", () => {
        expect(cursorPaginationQuerySchema.parse({})).toEqual({ limit: 20, includeTotal: false })
        expect(cursorPaginationQuerySchema.parse({ limit: "10", includeTotal: "true" })).toEqual({
            limit: 10,
            includeTotal: true,
        })
        for (const limit of [0, 101, 1.5]) expect(cursorPaginationQuerySchema.safeParse({ limit }).success).toBe(false)
        const result = ApiResponse.cursorPaginated(buildCursorPage([], 10, {}, 0))
        expect(result).toEqual({
            data: [],
            pagination: { limit: 10, next: null, prev: null, total: 0 },
            meta: { message: "OK", status: 200, type: "success" },
        })
        expect(result).not.toHaveProperty("page")
        expect(result).not.toHaveProperty("size")
    })
})
