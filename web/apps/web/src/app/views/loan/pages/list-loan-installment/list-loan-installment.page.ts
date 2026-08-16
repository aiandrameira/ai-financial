import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { LoanDto, LoanInstallmentDto } from "@domain/schemas";
import { LoanService } from "@infra/services";

import { DialogLoanInstallment, TableLoanInstallment } from "../../components";

@Component({
    selector: "ai-list-loan-installment",
    imports: [AiButton, AiHeading, AiIcon, TableLoanInstallment],
    templateUrl: "./list-loan-installment.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLoanInstallmentPage implements OnInit {
    #loanService = inject(LoanService);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    #loans = signal<LoanDto[]>([]);

    readonly id = input<string>("");

    readonly loan = computed(() => this.#loans().find(loan => loan.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#loanService.find().subscribe(loans => this.#loans.set(loans));
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
