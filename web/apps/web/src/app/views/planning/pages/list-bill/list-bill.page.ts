import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AiHeading } from "@core/ui";

import { TableBill } from "../../components";

@Component({
    selector: "ai-list-bill",
    imports: [AiHeading, TableBill],
    templateUrl: "./list-bill.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListBillPage {}
