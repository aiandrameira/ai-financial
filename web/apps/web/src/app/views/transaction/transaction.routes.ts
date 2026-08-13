import type { Route } from "@angular/router";

export const transactionRoutes: Route[] = [
    {
        path: "",
        loadComponent: () => import("./pages/list-transaction.page").then(m => m.ListTransactionPage),
    },
];
