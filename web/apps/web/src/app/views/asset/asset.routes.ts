import type { Route } from "@angular/router";

export const assetRoutes: Route[] = [
    {
        path: "",
        title: "Bens",
        data: { breadcrumb: "Bens", icon: "home" },
        loadComponent: () => import("./pages/list-asset/list-asset.page").then(c => c.ListAssetPage),
    },
];
