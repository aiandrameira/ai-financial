import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { CategoryFilterDto } from "../schemas";

import type { CategoryDto, RequestCategoryDto } from "../schemas";

export interface CategoryRepository {
    find(filter?: CategoryFilterDto): Observable<CursorPaginated<CategoryDto>>;
    findAll(filter?: CategoryFilterDto): Observable<CategoryDto[]>;
    create(input: RequestCategoryDto): Observable<CategoryDto>;
    update(id: string, input: RequestCategoryDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { CategoryDto };
