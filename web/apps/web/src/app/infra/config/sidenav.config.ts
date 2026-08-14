import type { SidenavGroup, SidenavUser, SidenavUserMenuItem } from "@core/ui";

export const SIDENAV_MODULES: SidenavGroup[] = [
    {
        label: "Financeiro",
        items: [
            { icon: "wallet", label: "Contas", path: "/accounts" },
            { icon: "exchange", label: "Transações", path: "/transactions" },
        ],
    },
];

export const SIDENAV_USER: SidenavUser = {
    name: "Aiandra Meira",
    email: "aiandraalves.meira@gmail.com",
};

export const SIDENAV_USER_MENU_ITEMS: SidenavUserMenuItem[] = [
    { icon: "user", label: "Perfil", action: "profile" },
    { icon: "settings-3", label: "Configurações", action: "settings" },
    { icon: "logout-circle-r", label: "Sair", action: "logout" },
];
