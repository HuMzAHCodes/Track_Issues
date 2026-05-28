import GoogleProvider from "next-auth/providers/google";

import prisma from "@/prisma/client";
import {PrismaAdapter} from"@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth";





const authOptions:NextAuthOptions={
    adapter:PrismaAdapter(prisma),
  providers:[ GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })],
  session: {
    strategy: "jwt"
  }
}



export default authOptions;

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS CONFIG LIVES IN ITS OWN FILE (NOT IN route.ts ANYMORE)
// ─────────────────────────────────────────────────────────────────────────────
// The object passed to NextAuth() must be importable in more than one place:
//   • app/api/auth/[...nextauth]/route.ts  → creates the auth API handler
//   • middleware.ts                        → reads the same session cookie rules
//   • getServerSession(authOptions)        → checks login on server pages & API routes
// If the config stayed only inside route.ts, those other files could not import it.
// One shared authOptions object keeps providers, adapter, and session behavior in sync.
// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE PROVIDER — HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
// GoogleProvider plugs Google OAuth 2.0 into your app.
// The flow when a user clicks "Sign in with Google":
//
//   1. User clicks sign in → NextAuth redirects to Google's login page
//   2. User approves access on Google's page
//   3. Google sends back an authorization code to /api/auth/callback/google
//   4. NextAuth exchanges that code for an access token behind the scenes
//   5. Google returns the user's profile (name, email, avatar)
//   6. NextAuth creates a session and stores it as a cookie in the browser
//   7. User is now logged in — that session is readable anywhere you pass authOptions
//
// clientId     → identifies YOUR app to Google (public, from Google Cloud Console)
// clientSecret → proves YOUR app's identity to Google (private, never expose this)
//
// Both live in .env — never hardcode them.
// The "!" tells TypeScript these env vars exist at runtime (non-null assertion).
// ─────────────────────────────────────────────────────────────────────────────
// PRISMA ADAPTER
// ─────────────────────────────────────────────────────────────────────────────
// PrismaAdapter(prisma) tells NextAuth to store users, accounts, and sessions in your
// database via Prisma instead of only in memory. After Google sign-in, user rows persist
// so the same person is recognized on the next visit.
// ─────────────────────────────────────────────────────────────────────────────
