import type { Route } from "@angular/router";

export const loanRoutes: Route[] = [
    {
        path: "",
        title: "Financiamentos",
        data: { breadcrumb: "Financiamentos", icon: "file-list" },
        loadComponent: () => import("./pages/list-loan/list-loan.page").then(c => c.ListLoanPage),
    },
    {
        path: ":id/installments",
        title: "Parcelas",
        data: { breadcrumb: "Parcelas", icon: "file-list" },
        loadComponent: () => import("./pages/list-loan-installment/list-loan-installment.page").then(c => c.ListLoanInstallmentPage),
    },
];
