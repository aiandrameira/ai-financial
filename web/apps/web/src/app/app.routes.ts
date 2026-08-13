import { Route } from "@angular/router";

export const appRoutes: Route[] = [
    { path: "", pathMatch: "full", redirectTo: "accounts" },
    {
        path: "accounts",
        loadChildren: () => import("./views/account/account.routes").then(m => m.accountRoutes),
    },
    {
        path: "transactions",
        loadChildren: () => import("./views/transaction/transaction.routes").then(m => m.transactionRoutes),
    },
];
