import { AiButton, AiIcon, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, form, required, submit, validateStandardSchema } from "@angular/forms/signals";
import { ActivatedRoute, Router } from "@angular/router";
import { SignInFormDto, signInFormSchema } from "@domain/schemas";
import { AuthService } from "@infra/services";

@Component({
    selector: "ai-login-page",
    imports: [FormField, AiInput, AiButton, AiIcon],
    templateUrl: "./login.page.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);
    #route = inject(ActivatedRoute);
    #router = inject(Router);

    readonly loading = signal(false);

    constructor() {
        // O better-auth redireciona pra cá com `?error=...` quando o callback do Google (ou
        // qualquer fluxo social) falha depois que o usuário já saiu do nosso app — ex.: login com
        // uma conta Google diferente da master, bloqueado pelo hook de cadastro único. Sem isso, o
        // usuário só via a URL com o erro cru e nenhuma explicação na tela.
        const error = this.#route.snapshot.queryParamMap.get("error_description") ?? this.#route.snapshot.queryParamMap.get("error");
        if (error) {
            this.#toast.destructive({ message: "Erro ao entrar com Google", description: error });
            this.#router.navigate([], { relativeTo: this.#route, queryParams: {}, replaceUrl: true });
        }
    }

    readonly value = signal<SignInFormDto>({ email: "", password: "" });
    readonly form = form(this.value, schema => {
        required(schema.email, { message: "O email é obrigatório." });
        required(schema.password, { message: "A senha é obrigatória." });
        validateStandardSchema(schema, signInFormSchema);
    });

    async onSubmit(): Promise<void> {
        await submit(this.form, async () => {
            this.loading.set(true);
            const error = await this.#auth.signIn(this.value().email, this.value().password);
            this.loading.set(false);

            if (error) this.#toast.destructive({ message: "Erro ao entrar", description: error });
        });
    }

    async onSignInGoogle(): Promise<void> {
        const error = await this.#auth.signInGoogle();
        if (error) this.#toast.destructive({ message: "Erro ao entrar com Google", description: error });
    }
}
