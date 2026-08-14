import { registerLocaleData } from "@angular/common";
import localePT from "@angular/common/locales/pt";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from "@angular/core";

registerLocaleData(localePT);

export const currencyConfig = [
    {
        provide: LOCALE_ID,
        useValue: "pt-BR",
    },
    {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: "BRL",
    },
];
