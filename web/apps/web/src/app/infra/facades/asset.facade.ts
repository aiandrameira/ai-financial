import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { AssetDto } from "@domain/repositories";
import type { RequestAssetDto } from "@domain/schemas";
import { AssetService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class AssetFacade {
    #service = inject(AssetService);

    #assets = signal<AssetDto[]>([]);
    assets = this.#assets.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const assets = await firstValueFrom(this.#service.find());
            this.#assets.set(assets);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestAssetDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestAssetDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestAssetDto): Promise<void> {
        if (input.id) {
            await this.update(input.id, input);
        } else {
            await this.create(input);
        }
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.#service.delete(id));
        await this.load();
    }
}
