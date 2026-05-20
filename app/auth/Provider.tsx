"use client"

// SessionProvider is a React context provider from next-auth
// it makes the user's session data accessible to every component in your app
// without it, you cannot use useSession() hook anywhere in your component tree
import { SessionProvider } from 'next-auth/react'
import React, { PropsWithChildren } from 'react'


// PropsWithChildren is a built-in TypeScript utility type from React
// it automatically adds "children: ReactNode" to your props interface
// so instead of writing { children: ReactNode } manually, PropsWithChildren does it for you
const AuthProvider = ({ children }: PropsWithChildren) => {
  return (

    // SessionProvider wraps the entire app (placed in layout.tsx)
    // it runs on the CLIENT side and does two things:
    //
    // 1. STORES THE SESSION — after Google login, next-auth creates a session
    //    (user info like name, email, avatar stored in a cookie)
    //    SessionProvider reads that cookie and stores it in React context
    //
    // 2. SHARES THE SESSION — any component inside this provider can call
    //    useSession() to instantly access the logged-in user's data
    //    without making a new database or API call each time
    //
    // flow:
    // user logs in via Google
    //   → next-auth creates session cookie
    //     → SessionProvider reads the cookie
    //       → useSession() in any component returns { data: session, status: "authenticated" }
    <SessionProvider>
      {children}
    </SessionProvider>

  )
}

export default AuthProvider


// ─────────────────────────────────────────────────────────────────────────────
// WHY A SEPARATE COMPONENT INSTEAD OF USING SESSIONPROVIDER DIRECTLY?
// ─────────────────────────────────────────────────────────────────────────────
// SessionProvider requires "use client" — but layout.tsx is a server component
// You cannot put "use client" in layout.tsx without making the entire layout
// a client component, which defeats the purpose of server-side rendering
//
// The solution: wrap SessionProvider in its own client component (this file)
// then import that wrapper into layout.tsx — layout stays a server component
// while SessionProvider still runs on the client where it needs to be
// ─────────────────────────────────────────────────────────────────────────────