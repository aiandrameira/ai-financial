import { Route } from "@angular/router";
import { AppShell } from "@core/ui";
import { authGuard } from "@infra/guards";
import { SIDENAV_MODULES, SIDENAV_USER_MENU_ITEMS } from "@infra/config";

export const appRoutes: Route[] = [
    {
        path: "auth",
        loadChildren: () => import("./views/auth/auth.routes").then(m => m.authRoutes),
    },
    { path: "", pathMatch: "full", redirectTo: "accounts" },
    {
        path: "",
        component: AppShell,
        canActivate: [authGuard],
        data: { groups: SIDENAV_MODULES, userMenuItems: SIDENAV_USER_MENU_ITEMS, breadcrumb: "Home", icon: "home" },
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
                path: "planning",
                loadChildren: () => import("./views/planning/planning.routes").then(m => m.planningRoutes),
            },
            {
                path: "loans",
                loadChildren: () => import("./views/loan/loan.routes").then(m => m.loanRoutes),
            },
            {
                path: "investments",
                loadChildren: () => import("./views/investment/investment.routes").then(m => m.investmentRoutes),
            },
            {
                path: "goals",
                loadChildren: () => import("./views/savings-goal/savings-goal.routes").then(m => m.savingsGoalRoutes),
            },
            {
                path: "assets",
                loadChildren: () => import("./views/asset/asset.routes").then(m => m.assetRoutes),
            },
        ],
    },
];
