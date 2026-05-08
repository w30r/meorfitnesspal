"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var better_auth_1 = require("better-auth");
var mongodb_1 = require("better-auth/adapters/mongodb");
var plugins_1 = require("better-auth/plugins");
var mongodb_2 = require("mongodb");
var uri = process.env.MONGODB_URI || "";
var client = new mongodb_2.MongoClient(uri);
var db = client.db("meorfitnesspal");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, mongodb_1.mongodbAdapter)(db),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [(0, plugins_1.username)()],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
});
