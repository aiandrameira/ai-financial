import type { Observable } from "rxjs";

import type { AssetDto, RequestAssetDto } from "../schemas";

export interface AssetRepository {
    find(): Observable<AssetDto[]>;
    create(input: RequestAssetDto): Observable<AssetDto>;
    update(id: string, input: RequestAssetDto): Observable<void>;
    delete(id: string): Observable<void>;
}

export type { AssetDto };
