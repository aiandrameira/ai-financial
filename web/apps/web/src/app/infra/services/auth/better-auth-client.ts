import { createAuthClient } from "better-auth/client";
import { environment } from "@env/environment";

type AuthClientInstance = ReturnType<typeof createAuthClient>;

export type GetSessionResponse = Awaited<ReturnType<AuthClientInstance["getSession"]>>;
export type SignInResponse = Awaited<ReturnType<AuthClientInstance["signIn"]["email"]>>;

export const betterAuthClient: AuthClientInstance = createAuthClient({
    baseURL: environment.apiUrl,
    basePath: "/auth",
    fetchOptions: {
        credentials: "include",
    },
});
