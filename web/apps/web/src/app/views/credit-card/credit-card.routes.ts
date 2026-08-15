import type { Route } from "@angular/router";

export const creditCardRoutes: Route[] = [
    {
        path: "",
        title: "Cartões",
        data: { breadcrumb: "Cartões", icon: "bank-card" },
        loadComponent: () => import("./pages/list-credit-card/list-credit-card.page").then(c => c.ListCreditCardPage),
    },
];
