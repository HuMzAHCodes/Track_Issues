import withAuth from "next-auth/middleware";

// Next.js 16 requires a real function export (re-exporting default from next-auth breaks).
// withAuth() checks the session cookie and redirects unauthenticated users to sign-in.
export default withAuth;

export const config = {
  matcher: [
    "/Issues/new", // unauthorized users cannot open the new-issue page
    "/Issues/:id/edit", // unauthorized users cannot open edit (matches /Issues/5/edit, etc.)
  ],
};

// now for that DELETE BUTTON,
// we did not have any sort of SEPERATE PAGE, all of this MATCHER SHIT was being done
// for SEPERATE PAGES

// SOLUTION ????

// ==>>>

// we just hide these BUTTONS from Anonymous USERS,,,,

// we go to  "/Issues/[id] /page.tsx "

// we pass the object we used TO INITIALIZE the "next-auth"
// it lies in  app/auth/authOptions.ts

// to the "getServerSession()" (in API routes and the issue detail page)

// ─────────────────────────────────────────────────────────────────────────────
// PROXY (formerly middleware) — WHAT IT DOES (AND session)
// ─────────────────────────────────────────────────────────────────────────────
// Runs before matched page routes. next-auth/middleware checks the same session cookie
// that getServerSession() reads later: if there is no valid session, the user is not
// logged in and gets redirected to sign-in instead of reaching /Issues/new or /Issues/:id/edit.
// A session is NextAuth's proof that someone signed in (stored in a cookie after Google OAuth).
// This file does not call getServerSession() itself — it only protects page URLs via the matcher.
// API routes and in-page buttons (e.g. Delete) still need getServerSession() or UI checks elsewhere.
// ─────────────────────────────────────────────────────────────────────────────
