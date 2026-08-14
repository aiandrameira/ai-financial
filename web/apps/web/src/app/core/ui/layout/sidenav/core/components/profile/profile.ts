import { AiAvatar, AiIcon, AiMenuImports, AiSeparator } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

import type { SidenavUser, SidenavUserMenuItem } from "../../../domain/schemas/sidenav.model";

@Component({
    selector: "ai-sidenav-profile",
    imports: [AiAvatar, AiIcon, AiMenuImports, AiSeparator],
    templateUrl: "./profile.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavProfile {
    user = input<SidenavUser | null>(null);
    userMenuItems = input<SidenavUserMenuItem[]>([]);
    collapsed = input<boolean>(false);

    userMenuAction = output<string>();

    protected onUserMenuAction(action: string): void {
        this.userMenuAction.emit(action);
    }

    protected initials(name: string): string {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part[0]?.toUpperCase())
            .join("");
    }
}
