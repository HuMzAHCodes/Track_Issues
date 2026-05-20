import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/prisma/client";
import {PrismaAdapter} from"@next-auth/prisma-adapter"

const handler = NextAuth({
    adapter:PrismaAdapter(prisma),
  providers:[ GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })]
})

export { handler as GET, handler as POST }


// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
// This file is the NextAuth route handler — it lives at:
// app/api/auth/[...nextauth]/route.ts
//
// The [...nextauth] is a catch-all route, meaning it handles ALL of these URLs:
// /api/auth/signin
// /api/auth/signout
// /api/auth/callback/google
// /api/auth/session
// /api/auth/csrf
// ...and more — all automatically handled by NextAuth internally
//
// You don't write any of this logic yourself — NextAuth handles it all
// behind the scenes just from this single configuration file
// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE PROVIDER — HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
// GoogleProvider plugs Google OAuth 2.0 into your app
// The flow when a user clicks "Sign in with Google":
//
// 1. User clicks sign in → NextAuth redirects to Google's login page
// 2. User approves access on Google's page
// 3. Google sends back an authorization code to /api/auth/callback/google
// 4. NextAuth exchanges that code for an access token behind the scenes
// 5. Google returns the user's profile (name, email, avatar)
// 6. NextAuth creates a session and stores it as a cookie
// 7. User is now logged in — session is accessible anywhere in your app
//
// clientId  → identifies YOUR app to Google (public, from Google Cloud Console)
// clientSecret → proves YOUR app's identity to Google (private, never expose this)
//
// Both are stored in .env as environment variables — never hardcoded
// The "!" at the end tells TypeScript to trust that these values exist
// and won't be undefined (non-null assertion)
// ─────────────────────────────────────────────────────────────────────────────
// WHY EXPORT AS BOTH GET AND POST
// ─────────────────────────────────────────────────────────────────────────────
// Next.js App Router requires you to explicitly export HTTP method handlers
// NextAuth needs both because:
// GET  → used for reading session, redirecting to Google, handling callbacks
// POST → used for signing in, signing out (form submissions)
//
// Both point to the same handler — NextAuth figures out internally
// what to do based on the URL and HTTP method it receives
// ─────────────────────────────────────────────────────────────────────────────