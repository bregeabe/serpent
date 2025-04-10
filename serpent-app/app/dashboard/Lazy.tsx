"use client";
import { useEffect } from "react";

export function Lazy({ username }: { username: string }) {
  useEffect(() => {
    async function setupUser() {
      try {
        await Promise.all([
          fetch("/api/github/setupUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }),
          fetch("/api/leetcode/setupUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }),
          fetch("/api/tracking/setupUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "imabe" }),
          }),
        ]);
      } catch (err) {
        console.error("Error setting up user:", err);
      }
    }

    setupUser();
  }, [username]);

  return null;
}
