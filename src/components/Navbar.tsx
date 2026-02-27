"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
import Logo from "./Logo";
import AuthButton from "./AuthButton";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: "Simulator", href: "/simulate" },
    { label: "Compare Offers", href: "/compare" },
    { label: "Market Insights", href: "/market-insights" },
    { label: "History Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className={styles.navContainer}>
      <Logo />
      
      <div className={styles.navLinks}>
        {/* Always show Home */}
        <Link 
          href="/" 
          className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}
        >
          <span>Home</span>
          {pathname === "/" && (
            <motion.div
              layoutId="nav-active"
              className={styles.activeIndicator}
            />
          )}
        </Link>

        {session && navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className={styles.activeIndicator}
                />
              )}
            </Link>
          );
        })}

        <AuthButton />
      </div>
    </nav>
  );
}
