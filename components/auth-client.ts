import { createAuthClient } from "better-auth/client";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
});

export const signIn = authClient.signIn as typeof authClient.signIn & {
  username: (params: { username: string; password: string }) => Promise<any>;
};

export const signUp = authClient.signUp as typeof authClient.signUp & {
  email: (params: { email: string; password: string; name: string; username: string }) => Promise<any>;
};

export const signOut = authClient.signOut;