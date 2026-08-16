import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { CreditCardDto, CreditCardInvoiceDto } from "@domain/schemas";
import { CreditCardService } from "@infra/services";

import { DialogCreditCardInvoice, TableCreditCardInvoice } from "../../components";

@Component({
    selector: "ai-list-credit-card-invoice",
    imports: [AiButton, AiHeading, TableCreditCardInvoice, AiIcon],
    templateUrl: "./list-credit-card-invoice.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreditCardInvoicePage implements OnInit {
    #creditCardService = inject(CreditCardService);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    #creditCards = signal<CreditCardDto[]>([]);

    readonly id = input<string>("");

    readonly creditCard = computed(() => this.#creditCards().find(creditCard => creditCard.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#creditCardService.find().subscribe(creditCards => this.#creditCards.set(creditCards));
    }

    protected goBack(): void {
        if (window.history.length > 1) {
            this.#location.back();
        } else {
            this.#router.navigate(["/credit-card"]);
        }
    }

    protected openInvoice(invoice: CreditCardInvoiceDto): void {
        this.#dialog.create<DialogCreditCardInvoice, { creditCardId: string; invoice: CreditCardInvoiceDto }>({
            ...formDialogOptions("Fatura", "Detalhes da fatura e compras realizadas.", "bill"),
            width: "560px",
            customClasses: "lg:max-w-[560px] w-full",
            component: DialogCreditCardInvoice,
            data: { creditCardId: this.id(), invoice },
        });
    }
}
