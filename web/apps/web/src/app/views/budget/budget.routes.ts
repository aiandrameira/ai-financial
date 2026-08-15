import type { Route } from "@angular/router";

export const budgetRoutes: Route[] = [
    {
        path: "",
        title: "Orçamento",
        data: { breadcrumb: "Orçamento", icon: "pie-chart" },
        loadComponent: () => import("./pages/list-budget/list-budget.page").then(c => c.ListBudgetPage),
    },
];
