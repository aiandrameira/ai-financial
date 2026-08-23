import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { CategoryDto, CategoryRepository } from "@domain/repositories";
import type { RequestCategoryDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CategoryService implements CategoryRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/categories");

    find(): Observable<CategoryDto[]> {
        return this.#client.get(this.#api, { params: { limit: 100 } }).pipe(map(response => mapFind(response)));
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
