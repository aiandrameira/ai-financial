import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { collectCursorPages, CursorPaginated, mapCursorPaginated } from "@core/ui";
import { AssetFilter } from "@domain/filters";
import { AssetFilterDto } from "@domain/schemas";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import type { AssetDto, AssetRepository } from "@domain/repositories";
import type { RequestAssetDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class AssetService implements AssetRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/assets");

    find(filter: AssetFilterDto = {}): Observable<CursorPaginated<AssetDto>> {
        const params = new AssetFilter(filter).getFilters().toParams();
        return this.#client.get(this.#api, { params }).pipe(map(response => mapCursorPaginated<AssetDto>(response)));
    }

    findAll(filter: AssetFilterDto = {}): Observable<AssetDto[]> {
        return collectCursorPages(cursor => this.find({ ...filter, limit: 100, cursor, includeTotal: false }));
    }

    create(body: RequestAssetDto): Observable<AssetDto> {
        return this.#client.post(this.#api, body).pipe(map(response => mapGet(response)));
    }

    update(id: string, body: RequestAssetDto): Observable<void> {
        return this.#client.put<void>(`${this.#api}/${id}`, body);
    }

    delete(id: string): Observable<void> {
        return this.#client.delete<void>(`${this.#api}/${id}`);
    }
}
