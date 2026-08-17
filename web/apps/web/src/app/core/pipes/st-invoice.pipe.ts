import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { stInvoiceEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

export interface StInvoiceConfig {
    variant: BadgeVariant;
    icon: AiIconType;
    bannerClass: string;
    iconWrapperClass: string;
}

@Pipe({
    name: "stInvoice",
})
export class StInvoicePipe implements PipeTransform {
    #map = new Map<stInvoiceEnum, StInvoiceConfig>([
        [
            stInvoiceEnum.OPEN,
            {
                variant: "info",
                icon: "bill",
                bannerClass: "bg-sky-500/10 dark:bg-sky-950/30 border-sky-500/20 text-sky-900 dark:text-sky-100",
                iconWrapperClass: "bg-sky-500/20 text-sky-600 dark:text-sky-400",
            },
        ],
        [
            stInvoiceEnum.CLOSED,
            {
                variant: "warning",
                icon: "bill",
                bannerClass: "bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/20 text-amber-900 dark:text-amber-100",
                iconWrapperClass: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
            },
        ],
        [
            stInvoiceEnum.PAID,
            {
                variant: "success",
                icon: "shield-check",
                bannerClass: "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-900 dark:text-emerald-100",
                iconWrapperClass: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            },
        ],
    ]);

    transform(status: stInvoiceEnum): StInvoiceConfig {
        return (
            this.#map.get(status) ?? {
                variant: "default",
                icon: "file-text",
                bannerClass: "bg-muted border-border text-foreground",
                iconWrapperClass: "bg-primary/10 text-primary",
            }
        );
    }
}
