import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./pages/login/login.page").then(component => component.LoginPage),
    },
];
