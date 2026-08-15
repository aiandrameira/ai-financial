import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.locale("pt-br");

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export function formatDateDayjs(date?: string): string {
    return date ? dayjs(date).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT);
}

export function formatDateTimeDayjs(date?: string): string {
    return date ? dayjs(date).format(DATETIME_FORMAT) : dayjs().format(DATETIME_FORMAT);
}

export function formatMonthYearDayjs(date: string): string {
    return dayjs.utc(date).format("MMMM [de] YYYY");
}

export function formatUtcDateDayjs(date: string): string {
    return dayjs.utc(date).format("DD/MM/YYYY");
}
