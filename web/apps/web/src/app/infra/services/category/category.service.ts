import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind } from "@core/ui";
import type { CategoryDto, CategoryRepository } from "@domain/repositories";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CategoryService implements CategoryRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/categories");

    find(): Observable<CategoryDto[]> {
        return this.#client.get(this.#api, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
    }
}
