import { AiBreadcrumbImports, AiBreadcrumbService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

@Component({
    selector: "ai-sidenav-header",
    imports: [AiBreadcrumbImports],
    templateUrl: "./header.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavHeader {
    protected readonly breadcrumbService = inject(AiBreadcrumbService);
}
