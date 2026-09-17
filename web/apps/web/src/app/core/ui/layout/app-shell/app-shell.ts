import { AiAlertDialogService, AiDialogService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { AuthService } from "@infra/services";

import { DialogProfile } from "../../components/dialog-profile/dialog-profile";
import { Sidenav, SidenavGroup, SidenavUserMenuItem } from "../sidenav";

@Component({
    selector: "ai-app-shell",
    imports: [Sidenav],
    template: ` <ai-sidenav [groups]="groups()" [user]="user()" [userMenuItems]="userMenuItems()" [sessionExpiresAt]="expiresAt()" (userMenuAction)="onUserMenuAction($event)" /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
    #auth = inject(AuthService);
    #dialog = inject(AiDialogService);
    #alertDialog = inject(AiAlertDialogService);

    groups = input<SidenavGroup[]>([]);
    userMenuItems = input<SidenavUserMenuItem[]>([]);

    protected readonly expiresAt = this.#auth.expiresAt;

    protected readonly user = computed(() => {
        const sessionUser = this.#auth.user();
        return sessionUser ? { name: sessionUser.name, email: sessionUser.email, avatarUrl: sessionUser.image ?? undefined } : null;
    });

    protected onUserMenuAction(action: string): void {
        if (action === "logout") this.#confirmSignOut();
        if (action === "profile") this.#openProfile();
    }

    #confirmSignOut(): void {
        this.#alertDialog.confirm({
            icon: { name: "logout-circle-r", color: "warning" },
            title: "Sair do sistema",
            description: "Tem certeza que deseja sair?",
            confirmText: "Sim, sair",
            cancelText: "Cancelar",
            onConfirm: () => this.#auth.signOut(),
        });
    }

    #openProfile(): void {
        this.#dialog.create({
            title: "Meu perfil",
            description: "Atualize seu nome e avatar.",
            component: DialogProfile,
            hideFooter: true,
            width: "400px",
        });
    }
}
