import middleware from 'next-auth/middleware';
export default middleware;

export const config = {
    matcher: [
        '/issues/new',      // shows that unauthorozed person can not add new issue
        '/issues/edit/:id+'   // shows unauth can't edit any issue , "+" shows that anything that comes
                              // after "edit" will be included in the route , otherwise ( in absense of +)
                              // teh route was liited to only "edit"
    ]
}



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
// MIDDLEWARE — WHAT IT DOES (AND session)
// ─────────────────────────────────────────────────────────────────────────────
// Runs before matched page routes. next-auth/middleware checks the same session cookie
// that getServerSession() reads later: if there is no valid session, the user is not
// logged in and gets redirected to sign-in instead of reaching /issues/new or /issues/edit/*.
// A session is NextAuth's proof that someone signed in (stored in a cookie after Google OAuth).
// This file does not call getServerSession() itself — it only protects page URLs via the matcher.
// API routes and in-page buttons (e.g. Delete) still need getServerSession() or UI checks elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

