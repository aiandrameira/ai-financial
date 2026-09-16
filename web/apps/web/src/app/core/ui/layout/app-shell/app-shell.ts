import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { AuthService } from "@infra/services";

import { Sidenav, SidenavGroup, SidenavUserMenuItem } from "../sidenav";

@Component({
    selector: "ai-app-shell",
    imports: [Sidenav],
    template: ` <ai-sidenav [groups]="groups()" [user]="user()" [userMenuItems]="userMenuItems()" (userMenuAction)="onUserMenuAction($event)" /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
    #auth = inject(AuthService);

    groups = input<SidenavGroup[]>([]);
    userMenuItems = input<SidenavUserMenuItem[]>([]);

    protected readonly user = computed(() => {
        const sessionUser = this.#auth.user();
        return sessionUser ? { name: sessionUser.name, email: sessionUser.email, avatarUrl: sessionUser.image ?? undefined } : null;
    });

    protected onUserMenuAction(action: string): void {
        if (action === "logout") this.#auth.signOut();
    }
}
