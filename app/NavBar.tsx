"use client";

import React from "react";
import Link from "next/link";
import { FaBug } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useSession } from "next-auth/react"
import { Avatar, Box, Container, DropdownMenu, Text } from "@radix-ui/themes";


const NavBar = () => {
  return (
    <nav className="border-b mb-5 px-5 h-14">
      <Container>
        <div className="flex justify-between items-center h-14">

          {/* ── LEFT SECTION — logo + nav links ── */}
          <div className="flex items-center space-x-6">
            <Link href="/">
              <FaBug />
            </Link>
            {/* ✅ NavLinks component used here */}
            <NavLinks />
          </div>

          {/* ── RIGHT SECTION — login / logout ── */}
          {/* ✅ AuthStatus component used here */}
          <AuthStatus />

        </div>
      </Container>
    </nav>
  );
};


const NavLinks = () => {

  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/Issues" }
  ];

  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={classNames(
              "transition-colors duration-300",
              {
                "text-black font-semibold": currentPath === link.href,
                "text-gray-500 hover:text-black": currentPath !== link.href
              }
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}


const AuthStatus = () => {

  const { status, data: session } = useSession();

  // while session is being fetched, render nothing to avoid layout flash
  if (status === "loading") return null;

  // ❌ SYNTAX ERROR: return was on its own line — JavaScript inserts a semicolon
  // after return automatically, making the JSX below it unreachable dead code
  // ✅ FIX: JSX must start on the same line as return, or be wrapped in ()
  if (status === "unauthenticated")
    return <Link href="/api/auth/signin"> Log In </Link>

  // if authenticated, show avatar with dropdown
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar
          src={session!.user!.image!}
          fallback="?"
          size="3"
          radius="full"
          className="cursor-pointer"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>
          <Text size="4">{session!.user!.email}</Text>
        </DropdownMenu.Label>
        <DropdownMenu.Item>
          <Link href="/api/auth/signout"> Log Out </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}


export default NavBar;