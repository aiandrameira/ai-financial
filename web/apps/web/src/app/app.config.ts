import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { currencyConfig } from "../../public/config";
import { appRoutes } from "./app.routes";

const providers = [currencyConfig];

export const appConfig: ApplicationConfig = {
    providers: [provideBrowserGlobalErrorListeners(), provideRouter(appRoutes, withComponentInputBinding()), provideHttpClient(), ...providers],
};
