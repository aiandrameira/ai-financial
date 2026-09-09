import type { Route } from "@angular/router";

export const planningRoutes: Route[] = [
    {
        path: "",
        title: "Planejamento",
        data: { breadcrumb: "Planejamento", icon: "compass-3" },
        loadComponent: () => import("./pages/financial-plan/financial-plan.page").then(c => c.FinancialPlanPage),
    },
    {
        path: "bills",
        title: "Contas fixas",
        data: { breadcrumb: "Contas fixas", icon: "calendar-check" },
        loadComponent: () => import("./pages/list-bill/list-bill.page").then(c => c.ListBillPage),
    },
];
