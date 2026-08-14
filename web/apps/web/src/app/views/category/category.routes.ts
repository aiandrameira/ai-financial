import type { Route } from "@angular/router";

export const categoryRoutes: Route[] = [
    {
        path: "",
        title: "Categorias",
        data: { breadcrumb: "Categorias", icon: "shapes" },
        loadComponent: () => import("./pages/list-category/list-category.page").then(c => c.ListCategoryPage),
    },
];
