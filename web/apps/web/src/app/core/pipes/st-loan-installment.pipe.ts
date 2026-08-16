import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { stLoanInstallmentEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "stLoanInstallment",
})
export class StLoanInstallmentPipe implements PipeTransform {
    #map = new Map<stLoanInstallmentEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [stLoanInstallmentEnum.PENDING, { variant: "info", icon: "time" }],
        [stLoanInstallmentEnum.PAID, { variant: "success", icon: "checkbox-circle" }],
        [stLoanInstallmentEnum.LATE, { variant: "destructive", icon: "error-warning" }],
    ]);

    transform(status: stLoanInstallmentEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(status) ?? { variant: "default", icon: "time" };
    }
}
