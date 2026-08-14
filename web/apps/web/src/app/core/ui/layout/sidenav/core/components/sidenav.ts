import { ChangeDetectionStrategy, Component, inject, input, output, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AiIcon, AiTooltipImports } from "@aiandralves/ai-ui";

import { SidenavService } from "../../infra/services/sidenav.service";
import type { SidenavGroup, SidenavUser, SidenavUserMenuItem } from "../../domain/schemas/sidenav.model";
import { SidenavFooter } from "./footer/footer";
import { SidenavHeader } from "./header/header";
import { SidenavProfile } from "./profile/profile";

@Component({
    selector: "ai-sidenav",
    imports: [RouterLink, RouterLinkActive, RouterOutlet, AiIcon, AiTooltipImports, SidenavHeader, SidenavFooter, SidenavProfile],
    providers: [SidenavService],
    templateUrl: "./sidenav.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
    private readonly sidenav = inject(SidenavService);

    groups = input<SidenavGroup[]>([]);
    user = input<SidenavUser | null>(null);
    userMenuItems = input<SidenavUserMenuItem[]>([]);

    userMenuAction = output<string>();

    protected readonly collapsed = this.sidenav.collapsed;
    protected readonly width = this.sidenav.width;
    protected readonly resizing = signal(false);

    protected toggleCollapsed(): void {
        this.sidenav.toggle();
    }

    protected onResizeStart(event: MouseEvent): void {
        event.preventDefault();
        this.resizing.set(true);

        const onMove = (moveEvent: MouseEvent) => {
            this.sidenav.resize(moveEvent.clientX);
        };

        const onUp = () => {
            this.resizing.set(false);
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    }

    protected onUserMenuAction(action: string): void {
        this.userMenuAction.emit(action);
    }
}
