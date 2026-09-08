import "@angular/compiler";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firstValueFrom, of, throwError } from "rxjs";

import { mapCursorPaginated } from "../api-response/api-response.mapper";
import { FilterProps } from "../filter/interface/filter-props.interface";
import { collectCursorPages } from "./collect-cursor-pages";
import { CursorPaginationState } from "./cursor-pagination.state";
import { createCursorSearchController } from "./cursor-table-controller";

describe("cursor table integration", () => {
    it("serializes cursor filters without losing false or zero values", () => {
        const filter = new FilterProps({ cursor: "next+/=", query: "conta & cartão", includeTotal: false, zero: 0, absent: undefined, blank: "" }).getFilters();
        assert.deepEqual(filter.toParams(), { cursor: "next+/=", query: "conta & cartão", includeTotal: "false", zero: "0" });
        assert.equal(new URLSearchParams(filter.buildFilters()).get("query"), "conta & cartão");
    });

    it("prevents navigation during loading and resets the cursor on limit or sort changes", () => {
        let loading = false;
        const state = new CursorPaginationState({
            sort: { sortBy: "name", sortDirection: "asc" },
            getPagination: () => ({ limit: 10, next: "next", prev: "previous", total: 30 }),
            isLoading: () => loading,
        });
        state.goNext();
        assert.equal(state.pageIndex(), 2);
        assert.equal(state.toQueryParams()["cursor"], "next");
        loading = true;
        state.goNext();
        state.goPrevious();
        assert.equal(state.pageIndex(), 2);
        loading = false;
        state.setPageSize(20);
        assert.equal(state.pageIndex(), 1);
        assert.equal(state.toQueryParams()["cursor"], undefined);
        state.goNext();
        state.setSort("name", "desc");
        assert.equal(state.pageIndex(), 1);
        assert.equal(state.toQueryParams()["sortDirection"], "desc");
    });

    it("applies trimmed searches and clears both the input and active search", () => {
        const state = new CursorPaginationState({ getPagination: () => ({ limit: 10, next: null, prev: null }), isLoading: () => false });
        const searches: string[] = [];
        const controller = createCursorSearchController({
            pageIndex: state.pageIndex,
            next: () => state.goNext(),
            previous: () => state.goPrevious(),
            changeLimit: limit => state.setPageSize(limit),
            search: query => searches.push(query),
        });
        controller.onQueryChange("  aluguel  ");
        controller.search();
        controller.clear();
        assert.deepEqual(searches, ["aluguel", ""]);
        assert.equal(controller.query(), "");
    });

    it("collects every page for selectors without discarding pagination metadata", async () => {
        const cursors: (string | undefined)[] = [];
        const items = await firstValueFrom(
            collectCursorPages<number>(cursor => {
                cursors.push(cursor);
                return of(mapCursorPaginated<number>({ data: cursor ? [3] : [1, 2], pagination: { limit: 2, next: cursor ? null : "page-2", prev: cursor ? "page-1" : null } }));
            }),
        );
        assert.deepEqual(items, [1, 2, 3]);
        assert.deepEqual(cursors, [undefined, "page-2"]);
    });

    it("propagates a failed later page instead of returning an incomplete selector", async () => {
        await assert.rejects(
            firstValueFrom(
                collectCursorPages<number>(cursor => (cursor ? throwError(() => new Error("offline")) : of({ data: [1], pagination: { limit: 1, next: "page-2", prev: null } }))),
            ),
            /offline/,
        );
        assert.throws(() => mapCursorPaginated({ data: [], page: 1, size: 10 }), /cursor/);
    });
});
