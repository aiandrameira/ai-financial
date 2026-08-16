import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { CurrencyPipe, Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { SavingsGoalFacade } from "@infra/facades";

import { DialogGoalContribution, TableGoalContribution } from "../../components";

@Component({
    selector: "ai-list-goal-contribution",
    imports: [AiButton, AiHeading, AiIcon, CurrencyPipe, TableGoalContribution],
    templateUrl: "./list-goal-contribution.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGoalContributionPage implements OnInit {
    #goalFacade = inject(SavingsGoalFacade);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    readonly id = input<string>("");

    readonly goal = computed(() => this.#goalFacade.goals().find(goal => goal.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#goalFacade.load();
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
