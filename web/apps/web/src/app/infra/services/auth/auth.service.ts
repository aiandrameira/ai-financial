import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { mapGet } from "@core/ui";
import { SessionUserDto } from "@domain/schemas";
import { environment } from "@env/environment";
import { map } from "rxjs/operators";

import { betterAuthClient } from "./better-auth-client";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    #router = inject(Router);
    #client = inject(HttpClient);

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

    uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append("file", file, file.name);
        return this.#client.post(`${environment.apiUrl}/uploads`, formData).pipe(map(response => mapGet<{ url: string }>(response)));
    }

    async updateProfile(data: { name?: string; image?: string }): Promise<string | null> {
        const { error } = await betterAuthClient.updateUser(data);
        return error ? (error.message ?? "Não foi possível atualizar o perfil.") : null;
    }

    patchLocalUser(changes: { name?: string; image?: string }): void {
        const current = this.#user();
        if (!current) return;
        this.#user.set({ ...current, ...changes });
    }
}
