import { AiToast } from "@aiandralves/ai-ui";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, AiToast],
    template: `
        <ai-toast />
        <router-outlet />
    `,
})
export class App {}
