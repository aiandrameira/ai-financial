import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { stInvoiceEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "stInvoice",
})
export class StInvoicePipe implements PipeTransform {
    #map = new Map<stInvoiceEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [stInvoiceEnum.OPEN, { variant: "info", icon: "file-text" }],
        [stInvoiceEnum.CLOSED, { variant: "warning", icon: "lock" }],
        [stInvoiceEnum.PAID, { variant: "success", icon: "checkbox-circle" }],
    ]);

    transform(status: stInvoiceEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(status) ?? { variant: "default", icon: "file-text" };
    }
}
