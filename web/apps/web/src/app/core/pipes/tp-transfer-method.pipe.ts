import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { tpTransferMethodEnum } from "@domain/enums";
import { BadgeVariant } from "@domain/types";

@Pipe({
    name: "tpTransferMethod",
})
export class TpTransferMethodPipe implements PipeTransform {
    #map = new Map<tpTransferMethodEnum, { variant: BadgeVariant; icon: AiIconType }>([
        [tpTransferMethodEnum.PIX, { variant: "success", icon: "qr-code" }],
        [tpTransferMethodEnum.TRANSFER, { variant: "info", icon: "exchange" }],
    ]);

    transform(method: tpTransferMethodEnum): { variant: BadgeVariant; icon: AiIconType } {
        return this.#map.get(method) ?? { variant: "default", icon: "exchange" };
    }
}
