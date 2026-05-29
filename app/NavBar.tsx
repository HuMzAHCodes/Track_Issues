"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBug } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Avatar, DropdownMenu, Text } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer keeps page content from sliding under the fixed navbar */}
      <div aria-hidden className="h-24 shrink-0" />

      <nav
        className={classNames(
          `
          glass-nav

          /* =========================
             TRANSPARENCY CONTROL
             =========================

             bg-white/50  -> 50% transparent white background

             CHANGE THIS VALUE TO CONTROL TRANSPARENCY:

             bg-white/10  = 10% visible (very transparent)
             bg-white/30  = 30% visible
             bg-white/50  = 50% visible
             bg-white/70  = 70% visible
             bg-white/100 = fully solid

             You can also use:
             bg-black/50
             bg-stone-900/50
          */

          bg-white/25

          fixed top-4 inset-x-6 z-50
          rounded-2xl px-6 h-16
          flex items-center
          backdrop-blur-xl
          `,
          scrolled ? "glass-nav-scrolled" : "glass-nav-top"
        )}
      >
        <div className="w-full flex justify-between items-center">

          {/* ── LEFT SECTION — logo + nav links ── */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center text-cherry hover:scale-110 transition-transform duration-300"
            >
              <FaBug className="text-cherry animate-float text-2xl" />
            </Link>

            {/* Navigation Links */}
            <NavLinks />
          </div>

          {/* ── RIGHT SECTION — login / logout ── */}
          <AuthStatus />

        </div>
      </nav>
    </>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/Issues" }
  ];

  return (
    <ul className="flex space-x-2">
      {links.map((link) => {
        const isActive = currentPath === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames(
                "transition-all duration-300 font-medium text-sm tracking-wide px-4 py-2 rounded-xl",
                {
                  "text-cherry font-semibold bg-cherry/10 shadow-sm shadow-cherry/5":
                    isActive,

                  "text-stone-600 hover:text-cherry dark:text-stone-300 hover:bg-stone-500/5":
                    !isActive
                }
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  // while session is being fetched, render skeleton
  if (status === "loading")
    return <Skeleton width="3rem" height="2rem" />;

  if (status === "unauthenticated") {
    return (
      <Link
        href="/api/auth/signin"
        className="
          bg-cherry
          text-white
          hover:bg-cherry-glow
          transition-all
          duration-300
          px-5
          py-2
          rounded-full
          font-medium
          text-sm
          shadow-md
          shadow-cherry/20
          hover:scale-105
        "
      >
        Log In
      </Link>
    );
  }

  // if authenticated, show avatar with dropdown
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="relative group cursor-pointer">
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="3"
            radius="full"
            className="
              cursor-pointer
              border-2
              border-cherry/20
              group-hover:border-cherry/80
              transition-all
              duration-300
              shadow-md
            "
          />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        variant="soft"
        className="glass-card shadow-2xl mt-2 p-1.5 min-w-[200px]"
      >
        <div className="px-2.5 py-1.5 border-b border-cherry/10 mb-1">
          <Text size="1" className="text-stone-400 block">
            Signed in as
          </Text>

          <Text
            size="2"
            weight="bold"
            className="text-cherry block truncate max-w-[170px]"
          >
            {session!.user!.email}
          </Text>
        </div>

        <DropdownMenu.Item className="rounded-lg hover:bg-cherry/10 transition-colors focus:bg-cherry/10 focus:text-cherry cursor-pointer">
          <Link
            href="/api/auth/signout"
            className="w-full h-full block py-1 font-medium text-sm"
          >
            Log Out
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NavBar;