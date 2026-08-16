import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapFind, mapGet } from "@core/ui";
import type { AssetDto, AssetRepository } from "@domain/repositories";
import type { RequestAssetDto } from "@domain/schemas";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class AssetService implements AssetRepository {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/assets");

    find(): Observable<AssetDto[]> {
        return this.#client.get(this.#api, { params: { page: 1, size: 100 } }).pipe(map(response => mapFind(response)));
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
