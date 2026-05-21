'use client';

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';


// QueryClient is the core engine of TanStack Query
// it manages everything behind the scenes:
// - stores the cached data from all API calls
// - tracks loading and error states for each query
// - handles retrying failed requests
// - decides when data is stale and needs refetching
// created ONCE outside the component so it persists across re-renders
const queryClient = new QueryClient();


// PropsWithChildren automatically adds "children: ReactNode" to the props type
// so we don't have to manually write { children: ReactNode }
// it's a built-in TypeScript utility from React for wrapper/provider components
const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (

    // ReactQueryClientProvider is the actual TanStack provider
    // it uses React Context to make the queryClient accessible
    // to every component in your app — without passing it as props manually
    // client={queryClient} connects the engine we created above to the provider
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>

  )
}

export default QueryClientProvider


// ─────────────────────────────────────────────────────────────────────────────
// WHY "QueryClientProvider as ReactQueryClientProvider" ?
// ─────────────────────────────────────────────────────────────────────────────
// TanStack exports its provider with the name "QueryClientProvider"
// But we are also naming OUR wrapper component "QueryClientProvider"
// Two things with the same name in the same file causes a conflict:
//
// ❌ without the alias — name clash, code breaks
// import { QueryClientProvider } from '@tanstack/react-query'
// const QueryClientProvider = ...   ← same name, TypeScript throws an error
//
// ✅ with the alias — no conflict, both names coexist
// import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'
// const QueryClientProvider = ...   ← our component keeps the clean name
//
// The alias renames the imported one to ReactQueryClientProvider
// so our own component can keep the shorter, cleaner name QueryClientProvider
// which is what gets imported in layout.tsx
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY A SEPARATE WRAPPER COMPONENT AT ALL?
// ─────────────────────────────────────────────────────────────────────────────
// TanStack's QueryClientProvider requires "use client"
// but layout.tsx is a server component — same problem as SessionProvider
// wrapping it in its own client component lets layout.tsx stay a server component
// while the provider still runs on the client where it needs to be
//
// layout.tsx (server)
//   └── QueryClientProvider (this file — client)
//         └── ReactQueryClientProvider (TanStack — client)
//               └── rest of the app can now use useQuery() anywhere
// ─────────────────────────────────────────────────────────────────────────────