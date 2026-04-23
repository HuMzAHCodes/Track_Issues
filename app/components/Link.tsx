import NextLink from 'next/link';
import { Link as RadixLink } from '@radix-ui/themes';
import { ReactNode } from 'react';        // ← add this

interface Props {
  href: string;
  children: ReactNode;                    // ← was: string
}

const Link = ({ href, children }: Props) => {
  return (
    <RadixLink asChild>
      <NextLink href={href}>{children}</NextLink>
    </RadixLink>
  )
}

export default Link



// No, nothing is lost. The new code achieves the exact same two goals as the original:

// Radix UI styling ✅ — RadixLink still applies its styles
// Next.js client-side navigation ✅ — NextLink still handles routing and prefetching

// // asChild is just the modern replacement for the legacyBehavior + passHref pattern. Same result, different API.