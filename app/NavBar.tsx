"use client"; // Enables client-side features (hooks, navigation state)

import React from "react";
import Link from "next/link";
import { FaBug } from "react-icons/fa6"; // Logo icon
import { usePathname } from "next/navigation"; // To get current route
import classNames from "classnames"; // Utility for conditional classes






const NavBar = () => {
  // Navigation links data
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "./Issues" }
  ];



  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Get current path (e.g., "/", "/Issues")
  const currentPath = usePathname();

  return (
    // Main navigation container
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      
      {/* Logo section */}
      <Link href="/">
        <FaBug />
      </Link>

      {/* Navigation links */}
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames(
                // Base styling (applies to all links)
                "transition-colors duration-300",

                // Conditional styling
                {
                  // Active link (current page)
                  "text-black font-semibold": currentPath === link.href,

                  // Inactive links
                  "text-gray-500 hover:text-black": currentPath !== link.href
                }
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

    </nav>
  );
};

export default NavBar;