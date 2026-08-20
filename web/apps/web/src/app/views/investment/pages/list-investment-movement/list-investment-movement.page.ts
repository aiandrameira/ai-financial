import { AiButton, AiDialogService, AiIcon } from "@aiandralves/ai-ui";
import { CurrencyPipe, Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AiHeading, StatCard } from "@core/ui";
import { formDialogOptions } from "@core/utils";
import { tpInvestmentMap } from "@domain/enums";
import { InvestmentAssetDto } from "@domain/schemas";
import { InvestmentService } from "@infra/services";

import { DialogInvestmentMovement, DialogInvestmentPrice, TableInvestmentMovement } from "../../components";

@Component({
    selector: "ai-list-investment-movement",
    imports: [AiButton, AiHeading, AiIcon, CurrencyPipe, TableInvestmentMovement, StatCard],
    templateUrl: "./list-investment-movement.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInvestmentMovementPage implements OnInit {
    #investmentService = inject(InvestmentService);
    #dialog = inject(AiDialogService);
    #location = inject(Location);
    #router = inject(Router);

    #assets = signal<InvestmentAssetDto[]>([]);

    readonly id = input<string>("");

    protected readonly tpInvestmentMap = tpInvestmentMap;

    readonly asset = computed(() => this.#assets().find(asset => asset.id === this.id()) ?? null);

    ngOnInit(): void {
        this.#investmentService.find().subscribe(assets => this.#assets.set(assets));
    }

    protected goBack(): void {
        if (window.history.length > 1) {
            this.#location.back();
        } else {
            this.#router.navigate(["/investments"]);
        }
    }

    protected openMovement(): void {
        this.#dialog.create<DialogInvestmentMovement, { investmentId: string }>({
            ...formDialogOptions("Registrar movimentação", "Compra, venda, dividendo, aporte ou resgate.", "line-chart"),
            width: "480px",
            component: DialogInvestmentMovement,
            data: { investmentId: this.id() },
        });
    }

    protected openPrice(): void {
        this.#dialog.create<DialogInvestmentPrice, { investmentId: string }>({
            ...formDialogOptions("Atualizar preço", "Registra um novo preço manual para o ativo.", "line-chart"),
            width: "400px",
            component: DialogInvestmentPrice,
            data: { investmentId: this.id() },
        });
    }
}
