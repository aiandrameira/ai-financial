import { AiButton, AiIcon } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { environment } from "@env/environment";

@Component({
    selector: "ai-sidenav-footer",
    imports: [AiButton, AiIcon],
    templateUrl: "./footer.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavFooter {
    protected readonly year = new Date().getFullYear();
    protected readonly version = environment.version;
}
