"use client";

import React from "react";
import Link from "next/link";
import { FaBug } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Box, Container } from "@radix-ui/themes";
import { useSession } from "next-auth/react"


const NavBar = () => {

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/Issues" }
  ];

  const { status, data: session } = useSession();

  const currentPath = usePathname();

  return (
    <nav className="border-b mb-5 px-5 h-14">

      {/* Container limits the max width and centers the content */}
      <Container>

        <div className="flex justify-between items-center h-14">

          {/* ── LEFT SECTION — logo + nav links ── */}
          <div className="flex items-center space-x-6">

            <Link href="/">
              <FaBug />
            </Link>

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

          </div>

          {/* ── RIGHT SECTION — login / logout ── */}
          <Box>
            {status === "authenticated" && (
              <Link href="/api/auth/signout"> Log Out </Link>
            )}
            {status === "unauthenticated" && (
              <Link href="/api/auth/signin"> Log In </Link>
            )}
          </Box>

        </div>

      </Container>

    </nav>
  );
};

export default NavBar;