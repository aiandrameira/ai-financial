import type { Observable } from "rxjs";

import type { CategoryDto } from "../schemas";

export interface CategoryRepository {
    find(): Observable<CategoryDto[]>;
}

export type { CategoryDto };
