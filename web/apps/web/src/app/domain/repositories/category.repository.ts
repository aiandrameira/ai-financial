import type { Observable } from "rxjs";

import type { CategoryDto, RequestCategoryDto } from "../schemas";

export interface CategoryRepository {
    find(): Observable<CategoryDto[]>;
    create(input: RequestCategoryDto): Observable<CategoryDto>;
    update(id: string, input: RequestCategoryDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { CategoryDto };
