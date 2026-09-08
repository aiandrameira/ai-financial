import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { CategoryFilter } from "@domain/filters";
import { CategoryFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { CategoryDto, CategoryRepository } from "@domain/repositories";
import type { RequestCategoryDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CategoryService implements CategoryRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/categories");

    find(filter: CategoryFilterDto = {}): Observable<CursorPaginated<CategoryDto>> {
        const params = new CategoryFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<CategoryDto>(response)));
    }

    findAll(filter: CategoryFilterDto = {}): Observable<CategoryDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestCategoryDto): Observable<CategoryDto> {
        return this.#client.post(this.#api, this._toBody(body)).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestCategoryDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, this._toBody(body));
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }

    private _toBody(body: RequestCategoryDto) {
        return { ...body, ...(body.parentId ? { parentId: body.parentId } : { parentId: undefined }) };
    }
}
