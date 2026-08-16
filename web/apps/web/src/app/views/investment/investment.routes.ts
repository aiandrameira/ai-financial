import type { Route } from "@angular/router";

export const investmentRoutes: Route[] = [
    {
        path: "",
        title: "Investimentos",
        data: { breadcrumb: "Investimentos", icon: "line-chart" },
        loadComponent: () => import("./pages/list-investment/list-investment.page").then(c => c.ListInvestmentPage),
    },
    {
        path: ":id/movements",
        title: "Movimentações",
        data: { breadcrumb: "Movimentações", icon: "line-chart" },
        loadComponent: () => import("./pages/list-investment-movement/list-investment-movement.page").then(c => c.ListInvestmentMovementPage),
    },
];
