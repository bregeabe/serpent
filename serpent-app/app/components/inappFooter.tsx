"use client";

import Link from "next/link";
import { Home, LayoutDashboard, Timer, SquareActivity } from "lucide-react";
import styles from "./styles/inappFooter.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link href="/">
          <Home className={styles.icon} size={18} />
        </Link>
        <Link href="/dashboard">
          <LayoutDashboard className={styles.icon} size={18} />
        </Link>
        <Link href="/tracking">
          <Timer className={styles.icon} size={18} />
        </Link>
        <Link href="/other">
          <SquareActivity className={styles.icon} size={18} />
        </Link>
      </nav>
    </footer>
  );
}
