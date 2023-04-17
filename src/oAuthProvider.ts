import { AuthBindings } from "@refinedev/core";
import { signIn, signOut, useSession } from "next-auth/react";

export const oAuthProvider: AuthBindings = {
    login: async () => {
        signIn("auth0", {
            callbackUrl: "/",
            redirect: true,
        });

        return {
            success: true,
        };
    },
    logout: async () => {
        signOut({
            redirect: true,
            callbackUrl: "/login",
        });

        return {
            success: true,
        };
    },
    onError: async (error) => {
        console.error(error);
        return {
            error,
        };
    },
    check: async () => {
        const { data, status } = useSession();
        if (status === "unauthenticated") {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }

        return {
            authenticated: true,
        };
    },
    getPermissions: async () => {
        return null;
    },
    getIdentity: async () => {
        const { data, status } = useSession();
        if (data?.user) {
            const { user } = data;
            return {
                name: user.name,
                avatar: user.image,
            };
        }

        return null;
    },
};
