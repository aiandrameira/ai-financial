import { Pipe, PipeTransform } from "@angular/core";
import { BadgeVariant } from "@domain/types";

export interface TrendConfig {
    variant: BadgeVariant;
    icon: string;
}

@Pipe({
    name: "trend",
})
export class TrendPipe implements PipeTransform {
    transform(value: number | string, baseValue?: number | string): TrendConfig {
        const numValue = Number(value) || 0;
        const numBase = baseValue !== undefined ? Number(baseValue) || 0 : 0;
        const delta = baseValue !== undefined ? numValue - numBase : numValue;

        if (delta < 0) return { variant: "destructive", icon: "trending_down" };
        if (delta > 0) return { variant: "success", icon: "trending_up" };
        return { variant: "info", icon: "trending_flat" };
    }
}
