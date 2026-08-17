import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { CurrencyPipe, Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading, StatCard } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { SavingsGoalDto } from "@domain/schemas";
import { SavingsGoalService } from "@infra/services";

import { DialogGoalContribution, TableGoalContribution } from "../../components";

@Component({
    selector: "ai-list-goal-contribution",
    imports: [AiButton, AiHeading, AiIcon, CurrencyPipe, TableGoalContribution, StatCard],
    templateUrl: "./list-goal-contribution.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGoalContributionPage implements OnInit {
    #goalService = inject(SavingsGoalService);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    #goals = signal<SavingsGoalDto[]>([]);

    readonly id = input<string>("");

    readonly goal = computed(() => this.#goals().find(goal => goal.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#goalService.find().subscribe(goals => this.#goals.set(goals));
    }

    protected goBack(): void {
        if (window.history.length > 1) {
            this.#location.back();
        } else {
            this.#router.navigate(["/goals"]);
        }
    }

    protected openContribution(): void {
        this.#dialog.create<DialogGoalContribution, { goalId: string }>({
            ...formDialogOptions("Registrar aporte", "Adicione um valor à meta.", "hand-coin"),
            width: "400px",
            component: DialogGoalContribution,
            data: { goalId: this.id() },
        });
    }
}
