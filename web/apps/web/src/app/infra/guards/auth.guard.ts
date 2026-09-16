import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@infra/services";

export const authGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.loaded()) await auth.loadSession();

    if (auth.user()) return true;

    return router.createUrlTree(["/auth/login"]);
};
