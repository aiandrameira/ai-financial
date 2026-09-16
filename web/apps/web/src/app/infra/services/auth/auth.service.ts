import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SessionUserDto } from "@domain/schemas";

import { betterAuthClient } from "./better-auth-client";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    #router = inject(Router);

    readonly #user = signal<SessionUserDto | null>(null);
    readonly #expiresAt = signal<Date | null>(null);
    readonly #loaded = signal(false);

    readonly user = this.#user.asReadonly();
    readonly expiresAt = this.#expiresAt.asReadonly();
    readonly loaded = this.#loaded.asReadonly();

    async loadSession(): Promise<void> {
        const { data } = await betterAuthClient.getSession({
            query: { disableCookieCache: true },
            fetchOptions: { cache: "no-store" },
        });
        const user = data?.user;
        this.#user.set(user ? { id: user.id, name: user.name, email: user.email, image: user.image ?? null } : null);
        this.#expiresAt.set(data?.session ? new Date(data.session.expiresAt) : null);
        this.#loaded.set(true);
    }

    async signIn(email: string, password: string): Promise<string | null> {
        const { error } = await betterAuthClient.signIn.email({ email, password });
        if (error) return error.message ?? "Não foi possível fazer login.";

        await this.loadSession();
        this.#router.navigateByUrl("/accounts");
        return null;
    }

    async signInGoogle(): Promise<string | null> {
        const { error } = await betterAuthClient.signIn.social({ provider: "google", callbackURL: window.location.origin });
        return error ? (error.message ?? "Não foi possível fazer login com Google.") : null;
    }

    async signOut(): Promise<void> {
        await betterAuthClient.signOut();
        this.#user.set(null);
        this.#expiresAt.set(null);
        this.#router.navigateByUrl("/auth/login");
    }
}
