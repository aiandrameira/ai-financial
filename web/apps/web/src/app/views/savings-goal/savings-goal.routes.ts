import type { Route } from "@angular/router";

export const savingsGoalRoutes: Route[] = [
    {
        path: "",
        title: "Metas",
        data: { breadcrumb: "Metas", icon: "triangular-flag" },
        loadComponent: () => import("./pages/list-savings-goal/list-savings-goal.page").then(c => c.ListSavingsGoalPage),
    },
    {
        path: ":id/contributions",
        title: "Aportes",
        data: { breadcrumb: "Aportes", icon: "triangular-flag" },
        loadComponent: () => import("./pages/list-goal-contribution/list-goal-contribution.page").then(c => c.ListGoalContributionPage),
    },
];
