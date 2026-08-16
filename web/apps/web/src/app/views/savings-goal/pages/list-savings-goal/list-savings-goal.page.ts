import { AiButton, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { SavingsGoalDto } from "@domain/schemas";

import { DialogSavingsGoal, TableSavingsGoal } from "../../components";

@Component({
    selector: "ai-list-savings-goal",
    imports: [AiButton, AiHeading, TableSavingsGoal],
    templateUrl: "./list-savings-goal.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSavingsGoalPage {
    #dialog = inject(AiDialogService);

    protected openCreate(): void {
        this._openDialog(null);
    }

    protected openEdit(goal: SavingsGoalDto): void {
        this._openDialog(goal);
    }

    private _openDialog(goal: SavingsGoalDto | null): void {
        const isNew = !goal;

        this.#dialog.create<DialogSavingsGoal, { goal: SavingsGoalDto | null }>({
            ...formDialogOptions(isNew ? "Cadastrar meta" : "Editar meta", "Preencha os dados da meta de economia.", "triangular-flag"),
            width: "560px",
            component: DialogSavingsGoal,
            data: { goal },
        });
    }
}
