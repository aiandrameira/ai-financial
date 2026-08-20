import type { AiIconType } from "@aiandralves/ai-ui";
import { Pipe, PipeTransform } from "@angular/core";
import { BadgeVariant } from "@domain/types";
import dayjs from "dayjs";

export interface DueSoonInfo {
    variant: BadgeVariant;
    icon: AiIconType;
    label: string;
}

const DUE_SOON_DAYS = 3;

@Pipe({
    name: "dueSoon",
})
export class DueSoonPipe implements PipeTransform {
    transform(dueDate: string, paidAt: string | null): DueSoonInfo {
        const formattedDate = dayjs.utc(dueDate).format("DD/MM/YYYY");

        if (paidAt) {
            return { variant: "default", icon: "calendar", label: formattedDate };
        }

        const dueUtc = dayjs.utc(dueDate);
        const dueLocal = dayjs().year(dueUtc.year()).month(dueUtc.month()).date(dueUtc.date()).startOf("day");
        const daysUntilDue = dueLocal.diff(dayjs().startOf("day"), "day");

        if (daysUntilDue < 0) {
            return { variant: "destructive", icon: "error-warning", label: `Venceu há ${Math.abs(daysUntilDue)} dia(s)` };
        }

        if (daysUntilDue === 0) {
            return { variant: "warning", icon: "alarm-warning", label: "Vence hoje" };
        }

        if (daysUntilDue <= DUE_SOON_DAYS) {
            return { variant: "warning", icon: "alarm-warning", label: `Vence em ${daysUntilDue} dia(s)` };
        }

        return { variant: "default", icon: "calendar", label: formattedDate };
    }
}
