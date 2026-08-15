import { Route } from "@angular/router";
import { Sidenav } from "@core/ui";
import { SIDENAV_MODULES, SIDENAV_USER, SIDENAV_USER_MENU_ITEMS } from "@infra/config";

export const appRoutes: Route[] = [
    { path: "", pathMatch: "full", redirectTo: "accounts" },
    {
        path: "",
        component: Sidenav,
        data: { groups: SIDENAV_MODULES, user: SIDENAV_USER, userMenuItems: SIDENAV_USER_MENU_ITEMS, breadcrumb: "Home", icon: "home" },
        children: [
            {
                path: "accounts",
                loadChildren: () => import("./views/account/account.routes").then(m => m.accountRoutes),
            },
            {
                path: "transactions",
                loadChildren: () => import("./views/transaction/transaction.routes").then(m => m.transactionRoutes),
            },
            {
                path: "categories",
                loadChildren: () => import("./views/category/category.routes").then(m => m.categoryRoutes),
            },
            {
                path: "credit-cards",
                loadChildren: () => import("./views/credit-card/credit-card.routes").then(m => m.creditCardRoutes),
            },
            {
                path: "budget",
                loadChildren: () => import("./views/budget/budget.routes").then(m => m.budgetRoutes),
            },
            {
                path: "loans",
                loadChildren: () => import("./views/loan/loan.routes").then(m => m.loanRoutes),
            },
        ],
    },
];
