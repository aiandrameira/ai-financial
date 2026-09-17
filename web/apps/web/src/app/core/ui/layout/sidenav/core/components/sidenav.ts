import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AiIcon, AiResizeHandle, AiTooltipImports } from "@aiandralves/ai-ui";
import { formatDuration } from "@core/helpers";

import { SIDENAV_COLLAPSED_WIDTH, SIDENAV_MAX_WIDTH, SIDENAV_MIN_WIDTH, SidenavService } from "../../infra/services/sidenav.service";
import type { SidenavGroup, SidenavUser, SidenavUserMenuItem } from "../../domain/schemas/sidenav.model";
import { SidenavFooter } from "./footer/footer";
import { SidenavHeader } from "./header/header";
import { SidenavProfile } from "./profile/profile";

@Component({
    selector: "ai-sidenav",
    imports: [RouterLink, RouterLinkActive, RouterOutlet, AiIcon, AiTooltipImports, AiResizeHandle, SidenavHeader, SidenavFooter, SidenavProfile],
    providers: [SidenavService],
    templateUrl: "./sidenav.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
    protected readonly sidenav = inject(SidenavService);

    groups = input<SidenavGroup[]>([]);
    user = input<SidenavUser | null>(null);
    userMenuItems = input<SidenavUserMenuItem[]>([]);
    sessionExpiresAt = input<Date | null>(null);

    userMenuAction = output<string>();

    protected readonly collapsed = this.sidenav.collapsed;
    protected readonly width = this.sidenav.width;
    protected readonly mobileOpen = this.sidenav.mobileOpen;
    protected readonly resizing = signal(false);

    readonly #now = signal(Date.now());
    protected readonly remainingSessionTime = computed(() => {
        const expiresAt = this.sessionExpiresAt();
        if (!expiresAt) return "00:00";
        return formatDuration(expiresAt.getTime() - this.#now());
    });

    constructor() {
        const interval = setInterval(() => this.#now.set(Date.now()), 1000);
        inject(DestroyRef).onDestroy(() => clearInterval(interval));
    }

    // "Collapsed" is a desktop density preference persisted in localStorage — the mobile overlay
    // must always render fully expanded (with labels), since its own collapse toggle is desktop-only
    // (hidden below `md:`), so a mobile user could otherwise get stuck with an icon-only drawer and
    // no way to expand it.
    protected readonly effectiveCollapsed = computed(() => (this.mobileOpen() ? false : this.collapsed()));

    protected readonly SIDENAV_MIN_WIDTH = SIDENAV_MIN_WIDTH;
    protected readonly SIDENAV_MAX_WIDTH = SIDENAV_MAX_WIDTH;
    protected readonly SIDENAV_COLLAPSED_WIDTH = SIDENAV_COLLAPSED_WIDTH;

    protected toggleCollapsed(): void {
        this.sidenav.toggle();
    }

    protected onUserMenuAction(action: string): void {
        this.userMenuAction.emit(action);
    }
}
