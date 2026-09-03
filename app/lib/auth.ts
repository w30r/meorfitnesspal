import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { MongoClient } from "mongodb";

let _auth: any;

export function getAuth() {
  if (!_auth) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    const client = new MongoClient(uri);
    const db = client.db("meorfitnesspal");
    _auth = betterAuth({
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
  }
  return _auth;
}

export type Session = typeof _auth.$Infer.Session.session;
