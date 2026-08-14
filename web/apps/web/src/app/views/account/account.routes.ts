import type { Route } from "@angular/router";

export const accountRoutes: Route[] = [
    {
        path: "",
        title: "Contas",
        data: { breadcrumb: "Contas", icon: "wallet" },
        loadComponent: () => import("./pages/list-account/list-account.page").then(c => c.ListAccountPage),
    },
];
