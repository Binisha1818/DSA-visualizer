"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./navbar.css";

export default function Navbar({ onMenuClick, menuOpen }) {
  const pathname = usePathname();

  const links = [
    { href: "/concepts/complexity", label: "Time Complexity" },
  ];

  return (
    <nav className="navbar">
  

      <div className="nav-right">
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button className="profile-button" type="button">
          B
        </button>
      </div>
    </nav>
  );
}