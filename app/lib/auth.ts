import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("meorfitnesspal");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [username()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  advanced: {
    trustedProxyHeaders: true,
    trustProxy: true,
  },
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        sameSite: "lax", // Try "lax" or "none" (if using none, secure must be true)
        secure: true,
        path: "/",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
