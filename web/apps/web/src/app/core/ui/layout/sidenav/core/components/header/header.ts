import { AiBreadcrumbImports, AiBreadcrumbService, AiButton } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { SidenavService } from "../../../infra/services/sidenav.service";

@Component({
    selector: "ai-sidenav-header",
    imports: [AiBreadcrumbImports, AiButton],
    templateUrl: "./header.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavHeader {
    protected readonly breadcrumbService = inject(AiBreadcrumbService);
    protected readonly sidenav = inject(SidenavService);
}
