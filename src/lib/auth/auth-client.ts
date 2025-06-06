import { createAuthClient} from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    fetchOptions: {
        credentials: "include",
        mode: "cors",
    },
    plugins: [ 
        usernameClient() 
    ], 
})

export const {
    signIn,
    signOut,
    signUp,
    getSession,
    useSession
} = authClient;