
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: "https://fullfocusmode.vercel.app",
})

// export const { signIn , signUp , useSession } = authClient;
