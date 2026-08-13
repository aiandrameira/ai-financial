import type { Route } from "@angular/router";

export const accountRoutes: Route[] = [
    {
        path: "",
        loadComponent: () => import("./pages/list-account.page").then(m => m.ListAccountPage),
    },
];
