import { inject, Injectable, signal } from "@angular/core";
import { finalize, forkJoin, Observable, tap } from "rxjs";

import type { BudgetDto, CategoryDto, RequestBudgetDto } from "@domain/schemas";
import { BudgetService, CategoryService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class BudgetFacade {
    #budgetService = inject(BudgetService);
    #categoryService = inject(CategoryService);

    #budgets = signal<BudgetDto[]>([]);
    readonly budgets = this.#budgets.asReadonly();

    #categories = signal<CategoryDto[]>([]);
    readonly categories = this.#categories.asReadonly();

    #loading = signal(false);
    readonly loading = this.#loading.asReadonly();

    load(referenceMonth: string): void {
        this.#loading.set(true);
        forkJoin([this.#budgetService.find(referenceMonth), this.#categoryService.find()])
            .pipe(finalize(() => this.#loading.set(false)))
            .subscribe(([budgets, categories]) => {
                this.#budgets.set(budgets);
                this.#categories.set(categories);
            });
    }

    create(input: RequestBudgetDto): Observable<BudgetDto> {
        return this.#budgetService.create(input).pipe(tap(() => this.load(input.referenceMonth)));
    }

    update(id: string, input: RequestBudgetDto): Observable<void> {
        return this.#budgetService.update(id, input).pipe(tap(() => this.load(input.referenceMonth)));
    }

    save(input: RequestBudgetDto): Observable<unknown> {
        if (input.id) {
            return this.update(input.id, input);
        }
        return this.create(input);
    }

    delete(id: string, referenceMonth: string): Observable<void> {
        return this.#budgetService.delete(id).pipe(tap(() => this.load(referenceMonth)));
    }
}
