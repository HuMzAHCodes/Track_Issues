import authOptions from "@/app/auth/authOptions"
import NextAuth from "next-auth"


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
// This is the NextAuth route handler at app/api/auth/[...nextauth]/route.ts.
// The [...nextauth] catch-all handles ALL of these URLs automatically:
//   /api/auth/signin
//   /api/auth/signout
//   /api/auth/callback/google
//   /api/auth/session
//   /api/auth/csrf
//   ...and more — NextAuth handles the logic; you only pass authOptions from authOptions.ts.
// ─────────────────────────────────────────────────────────────────────────────
// WHY EXPORT AS BOTH GET AND POST
// ─────────────────────────────────────────────────────────────────────────────
// Next.js App Router requires explicit HTTP method exports on route files.
// NextAuth needs both:
//   GET  → read session, redirect to Google, handle OAuth callbacks
//   POST → sign in, sign out (form submissions)
// Both use the same handler; NextAuth decides what to do from the URL and method.
// ─────────────────────────────────────────────────────────────────────────────