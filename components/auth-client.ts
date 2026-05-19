import { createAuthClient } from "better-auth/client";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
});

export const signIn = authClient.signIn as typeof authClient.signIn & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  username: (params: { username: string; password: string }) => Promise<any>;
};

export const signUp = authClient.signUp as typeof authClient.signUp & {
  email: (params: {
    email: string;
    password: string;
    name: string;
    username: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => Promise<any>;
};

export const logOut = authClient.signOut;
