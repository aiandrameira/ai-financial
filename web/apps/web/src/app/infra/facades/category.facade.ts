import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { CategoryDto } from "@domain/repositories";
import type { RequestCategoryDto } from "@domain/schemas";
import { CategoryService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class CategoryFacade {
    #service = inject(CategoryService);

    #categories = signal<CategoryDto[]>([]);
    categories = this.#categories.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(): Promise<void> {
        this.#loading.set(true);
        try {
            const categories = await firstValueFrom(this.#service.find());
            this.#categories.set(categories);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(input: RequestCategoryDto): Promise<void> {
        await firstValueFrom(this.#service.create(input));
        await this.load();
    }

    async update(id: string, input: RequestCategoryDto): Promise<void> {
        await firstValueFrom(this.#service.update(id, input));
        await this.load();
    }

    async save(input: RequestCategoryDto): Promise<void> {
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
