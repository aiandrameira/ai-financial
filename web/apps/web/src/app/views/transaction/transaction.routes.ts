import type { Route } from "@angular/router";

export const transactionRoutes: Route[] = [
    {
        path: "",
        title: "Transações",
        data: { breadcrumb: "Transações", icon: "exchange" },
        loadComponent: () => import("./pages/list-transaction/list-transaction.page").then(c => c.ListTransactionPage),
    },
];
