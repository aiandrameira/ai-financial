import { ChangeDetectionStrategy, Component, inject, input, output, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AiIcon, AiResizeHandle, AiTooltipImports } from "@aiandralves/ai-ui";

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

    userMenuAction = output<string>();

    protected readonly collapsed = this.sidenav.collapsed;
    protected readonly width = this.sidenav.width;
    protected readonly mobileOpen = this.sidenav.mobileOpen;
    protected readonly resizing = signal(false);

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
