import { inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { GoalContributionDto } from "@domain/repositories";
import type { RequestGoalContributionDto } from "@domain/schemas";
import { GoalContributionService } from "@infra/services";

@Injectable({ providedIn: "root" })
export class GoalContributionFacade {
    #service = inject(GoalContributionService);

    #contributions = signal<GoalContributionDto[]>([]);
    contributions = this.#contributions.asReadonly();

    #loading = signal(false);
    loading = this.#loading.asReadonly();

    async load(goalId: string): Promise<void> {
        this.#loading.set(true);
        try {
            const contributions = await firstValueFrom(this.#service.find(goalId));
            this.#contributions.set(contributions);
        } finally {
            this.#loading.set(false);
        }
    }

    async create(goalId: string, input: RequestGoalContributionDto): Promise<void> {
        await firstValueFrom(this.#service.create(goalId, input));
        await this.load(goalId);
    }

    async delete(goalId: string, id: string): Promise<void> {
        await firstValueFrom(this.#service.delete(goalId, id));
        await this.load(goalId);
    }
}
