import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { stTransactionEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "stTransaction",
})
export class StTransactionPipe implements PipeTransform {
    #map = new Map<stTransactionEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [stTransactionEnum.PLANNED, { variant: "info", icon: "calendar-todo" }],
        [stTransactionEnum.PENDING, { variant: "warning", icon: "timer" }],
        [stTransactionEnum.COMPLETED, { variant: "success", icon: "checkbox-circle" }],
        [stTransactionEnum.CANCELLED, { variant: "destructive", icon: "close-circle" }],
    ]);

    transform(status: stTransactionEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(status) ?? { variant: "default", icon: "info-i" };
    }
}
