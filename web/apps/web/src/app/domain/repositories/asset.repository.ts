import type { CursorPaginated } from "@core/ui";
import type { Observable } from "rxjs";
import type { AssetFilterDto } from "../schemas";

import type { AssetDto, RequestAssetDto } from "../schemas";

export interface AssetRepository {
    find(filter?: AssetFilterDto): Observable<CursorPaginated<AssetDto>>;
    findAll(filter?: AssetFilterDto): Observable<AssetDto[]>;
    create(input: RequestAssetDto): Observable<AssetDto>;
    update(id: string, input: RequestAssetDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { AssetDto };
