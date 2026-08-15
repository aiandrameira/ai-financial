import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { LoanInstallmentDto } from "@domain/schemas";
import { LoanFacade } from "@infra/facades";

import { DialogLoanInstallment, TableLoanInstallment } from "../../components";

@Component({
    selector: "ai-list-loan-installment",
    imports: [AiButton, AiHeading, AiIcon, TableLoanInstallment],
    templateUrl: "./list-loan-installment.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLoanInstallmentPage implements OnInit {
    #loanFacade = inject(LoanFacade);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    readonly id = input<string>("");

    readonly loan = computed(() => this.#loanFacade.loans().find(loan => loan.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#loanFacade.load();
    }

    protected goBack(): void {
        if (window.history.length > 1) {
            this.#location.back();
        } else {
            this.#router.navigate(["/loans"]);
        }
    }

    protected openInstallment(installment: LoanInstallmentDto): void {
        const loan = this.loan();
        if (!loan) return;

        this.#dialog.create<DialogLoanInstallment, { loan: typeof loan; installment: LoanInstallmentDto }>({
            ...formDialogOptions("Parcela", "Detalhes da parcela do financiamento.", "file-list"),
            width: "480px",
            component: DialogLoanInstallment,
            data: { loan, installment },
        });
    }
}
